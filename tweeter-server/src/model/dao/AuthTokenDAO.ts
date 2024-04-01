import { GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { AuthToken } from "../entity/AuthToken";
import { DAO } from "./DAO";

export class AuthTokenDAO extends DAO<AuthToken> {
    readonly token = "token";
    readonly timestamp = "timestamp";

    constructor() {
        super("authokens");
    }

    generateItem(authtoken: AuthToken) {
        return {
            [this.token]: authtoken.token,
        };
    }

    newEntity(output: GetCommandOutput): AuthToken {
        return new AuthToken(
            output.Item![this.token],
            output.Item![this.timestamp]
        );
    }

    generatePutItem(entity: AuthToken) {
        return {
            [this.token]: entity.token,
            [this.timestamp]: entity.timestamp,
        };
    }

    getUpdateExpression(entity: AuthToken): string {
        return "set timestamp = :value1";
    }

    getExpressionAttributeValues(entity: AuthToken) {
        return {
            ":value1": entity.timestamp,
        };
    }
}
