import { GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { AuthTokenEntity } from "../entity/AuthTokenEntity";
import { DDBDAO } from "./DDBDAO";

export class AuthTokenDAO extends DDBDAO<AuthTokenEntity> {
    readonly token = "token";
    readonly timestamp = "timestamp";
    readonly userHandle = "userHandle";

    constructor() {
        super("authokens");
    }

    generateItem(authtoken: AuthTokenEntity) {
        return {
            [this.token]: authtoken.token,
        };
    }

    newEntity(output: GetCommandOutput): AuthTokenEntity {
        return new AuthTokenEntity(
            output.Item![this.token],
            output.Item![this.timestamp],
            output.Item![this.userHandle]
        );
    }

    generatePutItem(entity: AuthTokenEntity) {
        return {
            [this.token]: entity.token,
            [this.timestamp]: entity.timestamp,
        };
    }

    getUpdateExpression(entity: AuthTokenEntity): string {
        return "set timestamp = :value1";
    }

    getExpressionAttributeValues(entity: AuthTokenEntity) {
        return {
            ":value1": entity.timestamp,
        };
    }
}
