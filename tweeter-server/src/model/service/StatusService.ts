import { AuthToken, User, Status, FakeData } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/interface/AuthTokenDAO";
import { StoryDAO } from "../dao/interface/StoryDAO";
import { FeedDAO } from "../dao/interface/FeedDAO";
import { DAOFactory } from "../dao/interface/DAOFactory";
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
            authToken
        );

        if (authenticated) {
            return this.feedDAO.getFeed(user, pageSize, lastItem);
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
            authToken
        );

        if (authenticated) {
            return this.storyDAO.getStory(user, pageSize, lastItem);
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
            authToken
        );

        if (authenticated) {
            await this.storyDAO.recordStory(newStatus);
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }
}
