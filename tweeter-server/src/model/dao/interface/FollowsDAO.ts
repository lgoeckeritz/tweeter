import { User } from "tweeter-shared";

export interface FollowsDAO {
    getPageOfFollowers(
        followeeHandle: string,
        pageSize: number,
        lastFollowerHandle: string | undefined
    ): Promise<[User[], boolean]>;
    getPageOfFollowees(
        followerHandle: string,
        pageSize: number,
        lastFolloweeHandle: string | undefined
    ): Promise<[User[], boolean]>;
    getFolloweesCount(followeeHandle: string): Promise<number>;
    getFollowersCount(followerHandle: string): Promise<number>;
    recordFollow(
        followerHandle: string,
        followerName: string,
        followeeHandle: string,
        followeeName: string
    ): Promise<void>;
    getIsFollow(
        followerHandle: string,
        followeeHandle: string
    ): Promise<boolean>;
    deleteFollow(followerHandle: string, followeeHandle: string): Promise<void>;
}
