import { AuthToken, User, Status, FakeData } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/interface/AuthTokenDAO";
import { StoryDAO } from "../dao/interface/StoryDAO";
import { FeedDAO } from "../dao/interface/FeedDAO";
import { DAOFactory } from "../dao/interface/DAOFactory";
import { DataPage } from "../entity/DataPage";
import { StatusEntity } from "../entity/StatusEntity";
export class StatusService {
    private authTokenDAO: AuthTokenDAO;
    private storyDAO: StoryDAO;
    private feedDAO: FeedDAO;

    constructor(daoFactory: DAOFactory) {
        this.authTokenDAO = daoFactory.getAuthTokensDAO();
        this.storyDAO = daoFactory.getStoryDAO();
        this.feedDAO = daoFactory.getFeedDAO();
    }

    public async loadMoreFeedItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        // return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
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
                const status: Status | null = Status.fromJson(
                    statusEntity.statusJson
                );
                if (status !== null) {
                    statusArr.push(status);
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
        // return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
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
        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
            //getting the user's handle
            const userHandle = await this.authTokenDAO.getAuthTokenHandle(
                authToken.token
            );
            await this.storyDAO.recordStory(
                new StatusEntity(
                    userHandle,
                    authToken.timestamp,
                    newStatus.toJson()
                )
            );

            //TODO: going to need to make a call to push this status to everyone following this user
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }
}
