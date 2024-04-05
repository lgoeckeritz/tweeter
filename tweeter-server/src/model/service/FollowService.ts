import { AuthToken, User } from "tweeter-shared";
import { DAOFactory } from "../dao/interface/DAOFactory";
import { DataPage } from "../entity/DataPage";
import { FollowEntity } from "../entity/FollowEntity";
import { UserEntity } from "../entity/UserEntity";
import { Service } from "./Service";

export class FollowService extends Service {
    constructor(daoFactory: DAOFactory) {
        super(daoFactory);
    }

    public async loadMoreFollowers(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        this.verfiyRequestData([authToken, user, pageSize]);
        this.authenticate(authToken.token);

        const pageOfFollowers = await this.followsDAO.getPageOfFollowers(
            user.alias,
            pageSize,
            lastItem?.alias
        );
        // converting to array of user's followers
        const followers: User[] = [];
        for (let i = 0; i < pageOfFollowers.values.length; i++) {
            const followerHandle = pageOfFollowers.values[i].followerHandle;
            const userEntity: UserEntity | undefined =
                await this.usersDAO.getUser(followerHandle);
            if (userEntity !== undefined) {
                const follower = new User(
                    userEntity.firstName,
                    userEntity.lastName,
                    userEntity.alias,
                    userEntity.imageUrl
                );
                followers.push(follower);
            }
        }

        return [followers, pageOfFollowers.hasMorePages];
    }

    public async loadMoreFollowees(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        this.verfiyRequestData([authToken, user, pageSize]);
        this.authenticate(authToken.token);

        const pageOfFollowees: DataPage<FollowEntity> =
            await this.followsDAO.getPageOfFollowees(
                user.alias,
                pageSize,
                lastItem?.alias
            );
        // converting to array of user's followees
        const followees: User[] = [];
        for (let i = 0; i < pageOfFollowees.values.length; i++) {
            const followeeHandle = pageOfFollowees.values[i].followeeHandle;
            const userEntity: UserEntity | undefined =
                await this.usersDAO.getUser(followeeHandle);
            if (userEntity !== undefined) {
                const followee = new User(
                    userEntity.firstName,
                    userEntity.lastName,
                    userEntity.alias,
                    userEntity.imageUrl
                );
                followees.push(followee);
            }
        }

        return [followees, pageOfFollowees.hasMorePages];
    }

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean> {
        this.verfiyRequestData([authToken, user, selectedUser]);
        this.authenticate(authToken.token);

        const follow = new FollowEntity(
            user.alias,
            user.firstName,
            selectedUser.alias,
            selectedUser.firstName
        );
        const result: FollowEntity | undefined =
            await this.followsDAO.getFollow(follow);

        if (result !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    public async getFolloweesCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        this.verfiyRequestData([authToken, user]);
        this.authenticate(authToken.token);

        const userEntity: UserEntity | undefined = await this.usersDAO.getUser(
            user.alias
        );
        this.verifyReturn(userEntity);
        return userEntity!.numFollowees;
    }

    public async getFollowersCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        this.verfiyRequestData([authToken, user]);
        this.authenticate(authToken.token);

        const userEntity: UserEntity | undefined = await this.usersDAO.getUser(
            user.alias
        );
        this.verifyReturn(userEntity);
        return userEntity!.numFollowers;
    }

    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followersCount: number, followeesCount: number]> {
        return await this.updateFollow(
            authToken,
            userToFollow,
            this.followsDAO.deleteFollow,
            1
        );
    }

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followersCount: number, followeesCount: number]> {
        return await this.updateFollow(
            authToken,
            userToUnfollow,
            this.followsDAO.deleteFollow,
            -1
        );
    }

    public async updateFollow(
        authToken: AuthToken,
        userToUpdate: User,
        followFunction: (follow: FollowEntity) => Promise<void>,
        numIncrement: number
    ): Promise<[followersCount: number, followeesCount: number]> {
        this.verfiyRequestData([authToken, numIncrement]);
        this.authenticate(authToken.token);

        const userHandle = await this.authTokenDAO.getAuthTokenHandle(
            authToken.token
        );
        const userEntity: UserEntity | undefined = await this.usersDAO.getUser(
            userHandle
        );
        if (userEntity === undefined) {
            throw new Error("[Server Error] couldn't find user");
        }
        await followFunction(
            new FollowEntity(
                userEntity.alias,
                userEntity.firstName,
                userToUpdate.alias,
                userToUpdate.firstName
            )
        );

        //need to update followers and following on this user and the
        //user that has just been unfollowed
        await this.usersDAO.updateNumFollowing(userEntity.alias, numIncrement);
        await this.usersDAO.updateNumFollowers(
            userToUpdate.alias,
            numIncrement
        );

        return [userEntity.numFollowers, userEntity.numFollowees];
    }
}
