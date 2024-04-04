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
        this.verfiyRequestData([authToken, userToFollow]);
        return await this.updateFollow(
            authToken.token,
            userToFollow.alias,
            userToFollow.firstName,
            1
        );
    }

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followersCount: number, followeesCount: number]> {
        this.verfiyRequestData([authToken, userToUnfollow]);
        return await this.updateFollow(
            authToken.token,
            userToUnfollow.alias,
            userToUnfollow.firstName,
            -1
        );
    }

    private async updateFollow(
        token: string,
        userAlias: string,
        userFirstName: string,
        numToIncrement: number
    ): Promise<[followersCount: number, followeesCount: number]> {
        this.authenticate(token);

        //getting the user
        const userHandle = await this.authTokenDAO.getAuthTokenHandle(token);
        const userEntity: UserEntity | undefined = await this.usersDAO.getUser(
            userHandle
        );
        this.verifyReturn(userEntity);
        await this.followsDAO.deleteFollow(
            new FollowEntity(
                userEntity!.alias,
                userEntity!.firstName,
                userAlias,
                userFirstName
            )
        );

        //adjusting follower and followees count
        await this.usersDAO.updateNumFollowing(
            userEntity!.alias,
            numToIncrement
        );
        await this.usersDAO.updateNumFollowers(userAlias, numToIncrement);

        return [userEntity!.numFollowers, userEntity!.numFollowees];
    }
}
