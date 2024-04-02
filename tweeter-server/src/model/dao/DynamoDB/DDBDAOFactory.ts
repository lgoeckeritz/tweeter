import { AuthTokenDAO } from "../interface/AuthTokenDAO";
import { DAOFactory } from "../interface/DAOFactory";
import { FeedDAO } from "../interface/FeedDAO";
import { FollowsDAO } from "../interface/FollowsDAO";
import { ImageDAO } from "../interface/ImageDAO";
import { StoryDAO } from "../interface/StoryDAO";
import { UsersDAO } from "../interface/UsersDAO";
import { DDBAuthTokenDAO } from "./DDBAuthTokenDAO";
import { DDBFeedDAO } from "./DDBFeedDAO";
import { DDBFollowsDAO } from "./DDBFollowsDAO";
import { DDBStoryDAO } from "./DDBStoryDAO";
import { DDBUsersDAO } from "./DDBUsersDAO";
import { S3ImageDAO } from "./S3ImageDAO";

export class DDBDAOFactory implements DAOFactory {
    getAuthTokensDAO(): AuthTokenDAO {
        return new DDBAuthTokenDAO();
    }
    getFeedDAO(): FeedDAO {
        return new DDBFeedDAO();
    }
    getFollowsDAO(): FollowsDAO {
        return new DDBFollowsDAO();
    }
    getStoryDAO(): StoryDAO {
        return new DDBStoryDAO();
    }
    getUsersDAO(): UsersDAO {
        return new DDBUsersDAO();
    }
    getImageDAO(): ImageDAO {
        return new S3ImageDAO();
    }
}
