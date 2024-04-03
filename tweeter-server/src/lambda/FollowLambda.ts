import { FollowInfoRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";
import { FollowService } from "../model/service/FollowService";
import { DDBDAOFactory } from "../model/dao/DynamoDB/DDBDAOFactory";

//TODO: need to make a new request that returns the num followers and followees
export const handler = async (
    event: FollowInfoRequest
): Promise<TweeterResponse> => {
    await new FollowService(new DDBDAOFactory()).follow(
        event.authToken,
        event.user
    );
    let response = new TweeterResponse(true);
    return response;
};
