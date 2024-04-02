import { Status, User } from "tweeter-shared";
import { DataPage } from "../../entity/DataPage";
import { StatusEntity } from "../../entity/StatusEntity";

export interface FeedDAO {
    recordFeed(user: User): Promise<void>; //not being used yet
    getFeed(
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<DataPage<StatusEntity>>;
}
