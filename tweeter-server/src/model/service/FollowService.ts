import { AuthToken, User } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/interface/AuthTokenDAO";
import { DAOFactory } from "../dao/interface/DAOFactory";
import { FollowsDAO } from "../dao/interface/FollowsDAO";
import { UsersDAO } from "../dao/interface/UsersDAO";

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
            return this.followsDAO.getPageOfFollowers(
                user.alias,
                pageSize,
                lastItem?.alias
            );
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
            return this.followsDAO.getPageOfFollowees(
                user.alias,
                pageSize,
                lastItem?.alias
            );
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
            return this.followsDAO.getIsFollow(user.alias, selectedUser.alias);
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
            return this.followsDAO.getFolloweesCount(user.alias);
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
            return this.followsDAO.getFollowersCount(user.alias);
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
            const user = await this.usersDAO.getUser(userHandle);
            await this.followsDAO.recordFollow(
                user!.alias,
                user!.firstName,
                userToFollow.alias,
                userToFollow.firstName
            );
            return [
                await this.followsDAO.getFollowersCount(userHandle),
                await this.followsDAO.getFolloweesCount(userHandle),
            ];
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
            await this.followsDAO.deleteFollow(
                userHandle,
                userToUnfollow.alias
            );
            return [
                await this.followsDAO.getFollowersCount(userHandle),
                await this.followsDAO.getFolloweesCount(userHandle),
            ];
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }
}
