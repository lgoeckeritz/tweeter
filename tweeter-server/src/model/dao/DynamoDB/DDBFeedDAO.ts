import { User, Status } from "tweeter-shared";
import { DataPage } from "../../entity/DataPage";
import { StatusEntity } from "../../entity/StatusEntity";
import { FeedDAO } from "../interface/FeedDAO";

export class DDBFeedDAO implements FeedDAO {
    recordFeed(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getFeed(
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<DataPage<StatusEntity>> {
        throw new Error("Method not implemented.");
    }
}
