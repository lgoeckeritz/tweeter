import { Status, User } from "tweeter-shared";

export interface StoryDAO {
    recordStory(story: Status): Promise<void>;
    getStory(
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]>;
}
