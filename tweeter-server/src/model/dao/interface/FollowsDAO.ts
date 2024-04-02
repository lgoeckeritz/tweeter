import { DataPage } from "../../entity/DataPage";
import { Follow } from "../../entity/Follow";

//TODO: look into cutting out the names from Follow
export interface FollowsDAO {
    getPageOfFollowers(
        followeeHandle: string,
        pageSize: number,
        lastFollowerHandle: string | undefined
    ): Promise<DataPage<Follow>>;
    getPageOfFollowees(
        followerHandle: string,
        pageSize: number,
        lastFolloweeHandle: string | undefined
    ): Promise<DataPage<Follow>>;
    getFolloweesCount(followeeHandle: string): Promise<number>;
    getFollowersCount(followerHandle: string): Promise<number>;
    recordFollow(follow: Follow): Promise<void>;
    getFollow(follow: Follow): Promise<Follow | undefined>;
    deleteFollow(follow: Follow): Promise<void>;
}
