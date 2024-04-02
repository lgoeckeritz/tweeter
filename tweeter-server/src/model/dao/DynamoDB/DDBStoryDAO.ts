import { User, Status } from "tweeter-shared";
import { DataPage } from "../../entity/DataPage";
import { StatusEntity } from "../../entity/StatusEntity";
import { StoryDAO } from "../interface/StoryDAO";

export class DDBStoryDAO implements StoryDAO {
    recordStory(statusEntity: StatusEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getStory(
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<DataPage<StatusEntity>> {
        throw new Error("Method not implemented.");
    }
}
