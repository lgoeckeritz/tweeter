import { User } from "tweeter-shared";
import { FollowEntity } from "../../entity/FollowEntity";
import { DataPage } from "../../entity/DataPage";

export interface FollowsDAO {
    getPageOfFollowers(
        followeeHandle: string,
        pageSize: number,
        lastFollowerHandle: string | undefined
    ): Promise<DataPage<FollowEntity>>;
    getPageOfFollowees(
        followerHandle: string,
        pageSize: number,
        lastFolloweeHandle: string | undefined
    ): Promise<DataPage<FollowEntity>>;
    getFolloweesCount(followeeHandle: string): Promise<number>;
    getFollowersCount(followerHandle: string): Promise<number>;
    recordFollow(follow: FollowEntity): Promise<void>;
    getFollow(follow: FollowEntity): Promise<FollowEntity | undefined>;
    deleteFollow(follow: FollowEntity): Promise<void>;
}
