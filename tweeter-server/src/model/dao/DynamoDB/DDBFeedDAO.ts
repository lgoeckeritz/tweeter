import { User, Status } from "tweeter-shared";
import { DataPage } from "../../entity/DataPage";
import { StatusEntity } from "../../entity/StatusEntity";
import { FeedDAO } from "../interface/FeedDAO";
import { DDBDAO } from "./DDBDAO";
import { GetCommandOutput, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class DDBFeedDAO extends DDBDAO<StatusEntity> implements FeedDAO {
    readonly owner_handle = "owner_handle";
    readonly time_stamp = "time_stamp";
    readonly status_json = "status_json";

    constructor() {
        super("feed");
    }

    newEntity(output: GetCommandOutput): StatusEntity {
        return new StatusEntity(
            output.Item![this.owner_handle],
            output.Item![this.time_stamp],
            output.Item![this.status_json]
        );
    }

    generateGetItem(entity: StatusEntity) {
        return {
            [this.owner_handle]: entity.handle,
            [this.time_stamp]: entity.time_stamp,
        };
    }

    generatePutItem(entity: StatusEntity) {
        return {
            [this.owner_handle]: entity.handle,
            [this.time_stamp]: entity.time_stamp,
            [this.status_json]: entity.statusJson,
        };
    }

    //not being used so not implimented
    getUpdateExpression(): string {
        throw new Error("Method not implemented.");
    }
    //not being used so not implimented
    getUpdateExpressionAttributeValues(entity: StatusEntity) {
        throw new Error("Method not implemented.");
    }

    async addStatus(statusEntity: StatusEntity): Promise<void> {
        this.putItem(statusEntity);
    }

    //no idea if this will actually work
    async getFeed(
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<DataPage<StatusEntity>> {
        const params = {
            KeyConditionExpression: this.owner_handle + " = :v",
            ExpressionAttributeValues: {
                ":v": user.alias,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastItem === null
                    ? undefined
                    : {
                          [this.owner_handle]: user.alias,
                          [this.status_json]: lastItem!.toJson(),
                      },
        };

        const items: StatusEntity[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                new StatusEntity(
                    item[this.owner_handle],
                    item[this.time_stamp],
                    item[this.status_json]
                )
            )
        );
        return new DataPage<StatusEntity>(items, hasMorePages);
    }
}
