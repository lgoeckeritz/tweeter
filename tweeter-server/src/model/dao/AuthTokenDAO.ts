import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken } from "../entity/AuthToken";

export class AuthTokenDAO {
    readonly tableName = "authtokens";
    readonly token = "token";
    readonly timestamp = "timestamp";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async recordAuthtoken(authtoken: AuthToken): Promise<void> {
        const authTokenInDatabase: AuthToken | undefined =
            await this.getAuthtoken(authtoken);
        if (authTokenInDatabase !== undefined) {
            console.log(
                "This authtoken is already in the database, updating timestamp"
            );
            await this.updateTimestamp(authtoken);
        } else {
            await this.putAuthtoken(authtoken);
        }
    }

    private async putAuthtoken(authtoken: AuthToken): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.token]: authtoken.token,
                [this.timestamp]: authtoken.timestamp,
            },
        };
        await this.client.send(new PutCommand(params));
    }

    private async updateTimestamp(authtoken: AuthToken): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateAuthtokenItem(authtoken),
            UpdateExpression: "set timestamp = :value1",
            ExpressionAttributeValues: {
                ":value1": authtoken.timestamp,
            },
        };
        await this.client.send(new UpdateCommand(params));
    }

    private async getAuthtoken(authtoken: AuthToken) {
        const params = {
            TableName: this.tableName,
            Key: this.generateAuthtokenItem(authtoken),
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined
            ? undefined
            : new AuthToken(
                  output.Item[this.token],
                  output.Item[this.timestamp]
              );
    }

    async deleteAuthtoken(authtoken: AuthToken): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateAuthtokenItem(authtoken),
        };
        await this.client.send(new DeleteCommand(params));
    }

    private generateAuthtokenItem(authtoken: AuthToken) {
        return {
            [this.token]: authtoken.token,
        };
    }
}
