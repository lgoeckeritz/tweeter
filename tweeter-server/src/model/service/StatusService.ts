import { AuthToken, User, Status } from "tweeter-shared";
import { DAOFactory } from "../dao/interface/DAOFactory";
import { DataPage } from "../entity/DataPage";
import { StatusEntity } from "../entity/StatusEntity";
import { UserEntity } from "../entity/UserEntity";
import { Service } from "./Service";
export class StatusService extends Service {
    constructor(daoFactory: DAOFactory) {
        super(daoFactory);
    }

    public async loadMoreFeedItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        this.verfiyRequestData([authToken, user, pageSize]);
        this.authenticate(authToken.token);
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
    }

    public async loadMoreStoryItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        this.verfiyRequestData([authToken, user, pageSize]);
        this.authenticate(authToken.token);
        const storyPage: DataPage<StatusEntity> = await this.storyDAO.getStory(
            user,
            pageSize,
            lastItem
        );

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
    }

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void> {
        this.verfiyRequestData([authToken, newStatus]);
        this.authenticate(authToken.token);

        const userHandle = newStatus.user.alias;
        const newStatusEntity = new StatusEntity(
            userHandle,
            newStatus.timestamp,
            newStatus.toJson()
        );
        await this.storyDAO.recordStory(newStatusEntity);

        //pushing the status to everyone that follows this user
        //getting the user to know how many followers there are
        const userEntity: UserEntity | undefined = await this.usersDAO.getUser(
            userHandle
        );

        if (userEntity !== undefined) {
            const numFollowers = userEntity.numFollowers;
            //getting list of all followers
            const followerPage = await this.followsDAO.getPageOfFollowers(
                userHandle,
                numFollowers,
                undefined
            );
            //adding the status to each of the followers of the user
            for (let i = 0; i < numFollowers; i++) {
                const follow = followerPage.values[i];
                await this.feedDAO.addStatus(
                    new StatusEntity(
                        follow.followerHandle,
                        newStatus.timestamp,
                        newStatus.toJson()
                    )
                );
            }
        }
    }
}
