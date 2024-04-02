import { DataPage } from "../../entity/DataPage";
import { FollowEntity } from "../../entity/FollowEntity";

//TODO: look into cutting out the names from Follow
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
