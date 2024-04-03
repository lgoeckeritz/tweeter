import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    GetCommandOutput,
    PutCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entity } from "../../entity/Entity";

export abstract class DDBDAO<T extends Entity> {
    readonly tableName: string;

    protected readonly client = DynamoDBDocumentClient.from(
        new DynamoDBClient()
    );

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    //might not be needed?
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

    async putItem(entity: T): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: this.generatePutItem(entity),
        };
        await this.client.send(new PutCommand(params));
    }

    async updateItem(entity: T): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateGetItem(entity),
            UpdateExpression: this.getUpdateExpression(),
            ExpressionAttributeValues:
                this.getUpdateExpressionAttributeValues(entity),
        };
        await this.client.send(new UpdateCommand(params));
    }

    async getItem(entity: T): Promise<T | undefined> {
        const params = {
            TableName: this.tableName,
            Key: this.generateGetItem(entity),
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined ? undefined : this.newEntity(output);
    }

    abstract newEntity(output: GetCommandOutput): T;

    async deleteItem(entity: T): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateGetItem(entity),
        };
        await this.client.send(new DeleteCommand(params));
    }

    /**
     * This should take the shape of what you're searching for in the table
     * It should include the partition key and the sort key if applicable
     * @param entity any entity that extends the class Entity
     */
    abstract generateGetItem(entity: T): any;

    /**
     * This should take the shape of an entire row being put into
     * the table. Ideally it will have the same number of elements
     * as the entity.
     * @param entity any entity that extends the class Entity
     */
    abstract generatePutItem(entity: T): any;

    abstract getUpdateExpression(): string;

    abstract getUpdateExpressionAttributeValues(entity: T): any;
}
