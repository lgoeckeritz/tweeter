import { Status, User } from "tweeter-shared";

export interface FeedDAO {
    recordFeed(user: User): Promise<void>; //not being used yet
    getFeed(
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]>;
}
