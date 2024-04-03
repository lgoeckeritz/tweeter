import { FollowInfoRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DDBDAOFactory } from "../model/dao/DynamoDB/DDBDAOFactory";

export const handler = async (
    event: FollowInfoRequest
): Promise<GetFollowCountResponse> => {
    let response = new GetFollowCountResponse(
        true,
        await new FollowService(new DDBDAOFactory()).getFollowersCount(
            event.authToken,
            event.user
        )
    );
    return response;
};
