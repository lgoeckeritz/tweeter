import { AuthToken, User, Status, FakeData } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/interface/AuthTokenDAO";
import { StoryDAO } from "../dao/interface/StoryDAO";
import { FeedDAO } from "../dao/interface/FeedDAO";
import { DAOFactory } from "../dao/interface/DAOFactory";
import { DataPage } from "../entity/DataPage";
import { StatusEntity } from "../entity/StatusEntity";
import { UserEntity } from "../entity/UserEntity";
import { UsersDAO } from "../dao/interface/UsersDAO";
import { FollowsDAO } from "../dao/interface/FollowsDAO";
export class StatusService {
    private authTokenDAO: AuthTokenDAO;
    private storyDAO: StoryDAO;
    private feedDAO: FeedDAO;
    private usersDAO: UsersDAO;
    private followsDAO: FollowsDAO;

    constructor(daoFactory: DAOFactory) {
        this.authTokenDAO = daoFactory.getAuthTokensDAO();
        this.storyDAO = daoFactory.getStoryDAO();
        this.feedDAO = daoFactory.getFeedDAO();
        this.usersDAO = daoFactory.getUsersDAO();
        this.followsDAO = daoFactory.getFollowsDAO();
    }

    public async loadMoreFeedItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        //checking to make sure request is good
        if (user === null || authToken === null || pageSize === null) {
            throw new Error("[Bad Request] part or all of the request is null");
        }

        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
            const feedPage: DataPage<StatusEntity> = await this.feedDAO.getFeed(
                user,
                pageSize,
                lastItem
            );

            const statusArr: Status[] = [];
            feedPage.values.forEach((statusEntity) => {
                try {
                    const status: Status | null = Status.fromJson(
                        statusEntity.statusJson
                    );
                    if (status !== null) {
                        statusArr.push(status);
                    }
                } catch (error) {
                    console.log("Found null status. Error: " + error);
                }
            });

            return [statusArr, feedPage.hasMorePages];
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }

    public async loadMoreStoryItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        //checking to make sure request is good
        if (user === null || authToken === null || pageSize === null) {
            throw new Error("[Bad Request] part or all of the request is null");
        }

        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
            const storyPage: DataPage<StatusEntity> =
                await this.storyDAO.getStory(user, pageSize, lastItem);

            const statusArr: Status[] = [];
            storyPage.values.forEach((statusEntity) => {
                const status: Status | null = Status.fromJson(
                    statusEntity.statusJson
                );
                if (status !== null) {
                    statusArr.push(status);
                }
            });

            return [statusArr, storyPage.hasMorePages];
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void> {
        //checking to make sure request is good
        if (authToken === null || newStatus === null) {
            throw new Error("[Bad Request] part or all of the request is null");
        }

        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
            //getting the user's handle
            const userHandle = await this.authTokenDAO.getAuthTokenHandle(
                authToken.token
            );
            const newStatusEntity = new StatusEntity(
                userHandle,
                Date.now(),
                newStatus.toJson()
            );
            await this.storyDAO.recordStory(newStatusEntity);

            //pushing the status to everyone that follows this user
            //getting the user to know how many followers there are
            const userEntity: UserEntity | undefined =
                await this.usersDAO.getUser(userHandle);

            if (userEntity !== undefined) {
                const numFollowers = userEntity.numFollowers;
                //getting list of all followers
                const followerPage = await this.followsDAO.getPageOfFollowers(
                    userHandle,
                    numFollowers,
                    undefined
                );
                //adding the status to each of the followers of the user
                followerPage.values.forEach((follow) => {
                    this.feedDAO.addStatus(
                        new StatusEntity(
                            follow.followeeHandle,
                            Date.now(),
                            newStatus.toJson()
                        )
                    );
                });
            }
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }
}
