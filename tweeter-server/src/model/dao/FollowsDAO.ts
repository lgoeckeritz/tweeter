import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Follow } from "../entity/Follow";
import { DataPage } from "../entity/DataPage";

export class FollowsDAO {
    readonly tableName = "follows";
    readonly indexName = "follows_index";
    readonly followerHandle = "follower_handle";
    readonly followeeHandle = "followee_handle";
    readonly followerName = "follower_name";
    readonly followeeName = "followee_name";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async getRelationship(follow: Follow): Promise<any[] | 0> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(follow),
        };
        const output = await this.client.send(new GetCommand(params));
        if (output.Item === undefined) {
            return 0;
        } else {
            return [
                output.Item[this.followerHandle],
                output.Item[this.followerName],
                output.Item[this.followeeHandle],
                output.Item[this.followeeName],
            ];
        }
    }

    async recordFollow(follow: Follow): Promise<void> {
        //load if it doesn't exist
        const followInDatabase: Follow | undefined = await this.getFollow(
            follow
        );
        if (followInDatabase !== undefined) {
            console.log(
                "This relationship is already in the database, updating names"
            );
            await this.updateNames(follow);
        } else {
            await this.putFollow(follow);
        }
    }

    private async putFollow(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followerHandle]: follow.followerHandle,
                [this.followerName]: follow.followerName,
                [this.followeeHandle]: follow.followeeHandle,
                [this.followeeName]: follow.followeeName,
            },
        };
        await this.client.send(new PutCommand(params));
    }

    private async updateNames(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(follow),
            UpdateExpression:
                "set follower_name = :value1, followee_name = :value2",
            ExpressionAttributeValues: {
                ":value1": follow.followerName,
                ":value2": follow.followeeName,
            },
        };
        await this.client.send(new UpdateCommand(params));
    }

    private async getFollow(follow: Follow): Promise<Follow | undefined> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(follow),
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined
            ? undefined
            : new Follow(
                  output.Item[this.followerHandle],
                  output.Item[this.followerName],
                  output.Item[this.followeeHandle],
                  output.Item[this.followeeName]
              );
    }

    async deleteFollow(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(follow),
        };
        await this.client.send(new DeleteCommand(params));
    }

    private generateFollowItem(follow: Follow) {
        return {
            [this.followerHandle]: follow.followerHandle,
            [this.followeeHandle]: follow.followeeHandle,
        };
    }

    async getPageOfFollowees(
        followerHandle: string,
        pageSize: number,
        lastFolloweeHandle: string | undefined = undefined
    ): Promise<DataPage<Follow>> {
        const params = {
            KeyConditionExpression: this.followerHandle + " = :v",
            ExpressionAttributeValues: {
                ":v": followerHandle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFolloweeHandle === undefined
                    ? undefined
                    : {
                          [this.followerHandle]: followerHandle,
                          [this.followeeHandle]: lastFolloweeHandle,
                      },
        };

        const items: Follow[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                new Follow(
                    item[this.followerHandle],
                    item[this.followerName],
                    item[this.followeeHandle],
                    item[this.followeeName]
                )
            )
        );
        return new DataPage<Follow>(items, hasMorePages);
    }

    async getPageOfFollowers(
        followeeHandle: string,
        pageSize: number,
        lastFollowerHandle: string | undefined = undefined
    ): Promise<DataPage<Follow>> {
        const params = {
            KeyConditionExpression: this.followeeHandle + " = :v",
            ExpressionAttributeValues: {
                ":v": followeeHandle,
            },
            TableName: this.tableName,
            IndexName: this.indexName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFollowerHandle === undefined
                    ? undefined
                    : {
                          [this.followeeHandle]: followeeHandle,
                          [this.followerHandle]: lastFollowerHandle,
                      },
        };

        const items: Follow[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                new Follow(
                    item[this.followerHandle],
                    item[this.followerName],
                    item[this.followeeHandle],
                    item[this.followeeName]
                )
            )
        );
        return new DataPage<Follow>(items, hasMorePages);
    }
}
