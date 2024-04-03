import { AuthToken, User } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/interface/AuthTokenDAO";
import { DAOFactory } from "../dao/interface/DAOFactory";
import { FollowsDAO } from "../dao/interface/FollowsDAO";
import { DataPage } from "../entity/DataPage";
import { FollowEntity } from "../entity/FollowEntity";
import { UsersDAO } from "../dao/interface/UsersDAO";
import { UserEntity } from "../entity/UserEntity";

export class FollowService {
    private authTokenDAO: AuthTokenDAO;
    private followsDAO: FollowsDAO;
    private usersDAO: UsersDAO;

    constructor(daoFactory: DAOFactory) {
        this.authTokenDAO = daoFactory.getAuthTokensDAO();
        this.followsDAO = daoFactory.getFollowsDAO();
        this.usersDAO = daoFactory.getUsersDAO();
    }

    public async loadMoreFollowers(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
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
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }

    public async loadMoreFollowees(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
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
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean> {
        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
            //may have to be updated to first and last names?
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
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }

    public async getFolloweesCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
            const userEntity: UserEntity | undefined =
                await this.usersDAO.getUser(user.alias);
            if (userEntity !== undefined) {
                return userEntity.numFollowees;
            } else {
                throw new Error("[Server Error] couldn't find user");
            }
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }

    public async getFollowersCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
            const userEntity: UserEntity | undefined =
                await this.usersDAO.getUser(user.alias);
            if (userEntity !== undefined) {
                return userEntity.numFollowers;
            } else {
                throw new Error("[Server Error] couldn't find user");
            }
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }

    //TODO: the handler all the way down to UserInfo.tsx needs to be changed to send up the user too
    //TODO: ignore that last comment and go remove the other comments leading up to it
    //TODO: look into just storing the user's handle with an authtoken so a user doesn't have to be passed up
    //TODO: also store a number of followers and followees in the user table for a quick way to get number of followers
    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followersCount: number, followeesCount: number]> {
        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
            //getting the user
            const userHandle = await this.authTokenDAO.getAuthTokenHandle(
                authToken.token
            );
            const userEntity = await this.usersDAO.getUser(userHandle);
            if (userEntity === undefined) {
                throw new Error("[Server Error] couldn't find user");
            }
            await this.followsDAO.recordFollow(
                new FollowEntity(
                    userEntity.alias,
                    userEntity.firstName,
                    userToFollow.alias,
                    userToFollow.firstName
                )
            );

            return [userEntity.numFollowers, userEntity.numFollowees];
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followersCount: number, followeesCount: number]> {
        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
            //getting the user
            const userHandle = await this.authTokenDAO.getAuthTokenHandle(
                authToken.token
            );
            const userEntity: UserEntity | undefined =
                await this.usersDAO.getUser(userHandle);
            if (userEntity === undefined) {
                throw new Error("[Server Error] couldn't find user");
            }
            await this.followsDAO.deleteFollow(
                new FollowEntity(
                    userEntity.alias,
                    userEntity.firstName,
                    userToUnfollow.alias,
                    userToUnfollow.firstName
                )
            );
            return [userEntity.numFollowers, userEntity.numFollowees];
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }
}
