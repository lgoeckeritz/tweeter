import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    GetCommandOutput,
    PutCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entity } from "../entity/Entity";

export abstract class DAO<T extends Entity> {
    readonly tableName: string;
    readonly updateExpression: string;
    readonly expressionAttributes: Record<string, string>; //maybe any? idk

    protected readonly client = DynamoDBDocumentClient.from(
        new DynamoDBClient()
    );

    constructor(
        tableName: string,
        updateExpression: string,
        expressionAttributes: Record<string, string>
    ) {
        this.tableName = tableName;
        this.updateExpression = updateExpression;
        this.expressionAttributes = expressionAttributes;
    }

    async recordItem(entity: T): Promise<void> {
        //load if it doesn't exist
        const itemInDatabase: T | undefined = await this.getItem(entity);
        if (itemInDatabase !== undefined) {
            console.log(
                "This item is already in the ",
                this.tableName,
                "table, updating values of existing item"
            );
            await this.updateItem(entity);
        } else {
            await this.putItem(entity);
        }
    }

    protected async putItem(entity: T): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: this.generatePutItem(entity),
        };
        await this.client.send(new PutCommand(params));
    }

    protected async updateItem(entity: T): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateItem(entity),
            UpdateExpression: this.updateExpression,
            ExpressionAttributeValues: this.expressionAttributes,
        };
        await this.client.send(new UpdateCommand(params));
    }

    protected async getItem(entity: T): Promise<T | undefined> {
        const params = {
            TableName: this.tableName,
            Key: this.generateItem(entity),
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined ? undefined : this.newEntity(output);
    }

    abstract newEntity(output: GetCommandOutput): T;

    async delete(entity: T): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateItem(entity),
        };
        await this.client.send(new DeleteCommand(params));
    }

    abstract generateItem(entity: T): any;

    abstract generatePutItem(entity: T): any; // maybe Record<string, string> ?
}
