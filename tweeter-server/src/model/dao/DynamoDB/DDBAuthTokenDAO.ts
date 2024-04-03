import { GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { AuthTokenEntity } from "../../entity/AuthTokenEntity";
import { AuthTokenDAO } from "../interface/AuthTokenDAO";
import { DDBDAO } from "./DDBDAO";

export class DDBAuthTokenDAO
    extends DDBDAO<AuthTokenEntity>
    implements AuthTokenDAO
{
    readonly token = "token";
    readonly timestamp = "timestamp";
    readonly user_handle = "user_handle";
    readonly expirationTime = 10;

    constructor() {
        super("authokens");
    }

    generateGetItem(authtoken: AuthTokenEntity) {
        return {
            [this.token]: authtoken.token,
        };
    }

    newEntity(output: GetCommandOutput): AuthTokenEntity {
        return new AuthTokenEntity(
            output.Item![this.token],
            output.Item![this.timestamp],
            output.Item![this.user_handle]
        );
    }

    generatePutItem(entity: AuthTokenEntity) {
        return {
            [this.token]: entity.token,
            [this.timestamp]: entity.timestamp,
            [this.user_handle]: entity.userHandle,
        };
    }

    getUpdateExpression(): string {
        return "set timestamp = :value1";
    }

    getUpdateExpressionAttributeValues(entity: AuthTokenEntity) {
        return {
            ":value1": entity.timestamp,
        };
    }

    /**
     * Checks to see if the authtoken provided is currently in the database
     * and not timed out. If it is and not timed out, the timestamp is updated
     * to the current time and this returns true
     * @param token is the authToken that should be in the database
     */
    async authenticate(token: string): Promise<boolean> {
        const currentToken: AuthTokenEntity = new AuthTokenEntity(
            token,
            Date.now(),
            "unknown"
        );
        const oldToken: AuthTokenEntity | undefined = await this.getItem(
            currentToken
        );
        if (oldToken !== undefined) {
            // Calculate the difference in minutes
            let differenceInMinutes =
                Math.abs(currentToken.timestamp - oldToken?.timestamp) /
                1000 /
                60;

            if (differenceInMinutes <= this.expirationTime) {
                //now that the authtoken is valid, the timestamp needs to be updated
                currentToken.userHandle = oldToken.userHandle;
                await this.updateItem(currentToken);
                return true;
            } else {
                //deletes the timed out authtoken
                this.deleteAuthToken(token);
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * This lets us find the userhandle that's associated with an authtoken
     * @param token is associated with the handle of the user we're trying to find
     */
    async getAuthTokenHandle(token: string): Promise<string> {
        const foundToken: AuthTokenEntity | undefined = await this.getItem(
            new AuthTokenEntity(token, 0, "unknown")
        );
        if (foundToken === undefined) {
            throw new Error("[Forbidden Error] invalid authtoken");
        }
        return foundToken.userHandle;
    }

    /**
     * This stores a new authtoken in the table when someone logs in or registers
     * @param authTokenEntity new authtoken to store in the table
     */
    async recordAuthToken(authTokenEntity: AuthTokenEntity): Promise<void> {
        this.putItem(authTokenEntity);
    }

    /**
     * Removes token from table, usually when found to be timed out
     * or when the user is logging out. Not essential but it keeps the
     * tables from filling up.
     * @param token token to be removed
     */
    async deleteAuthToken(token: string): Promise<void> {
        this.deleteItem(new AuthTokenEntity(token, 0, "unknown"));
    }
}
