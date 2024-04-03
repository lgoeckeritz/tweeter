import { FollowInfoRequest, GetFollowInfoResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DDBDAOFactory } from "../model/dao/DynamoDB/DDBDAOFactory";

export const handler = async (
    event: FollowInfoRequest
): Promise<GetFollowInfoResponse> => {
    let response = new GetFollowInfoResponse(
        true,
        ...(await new FollowService(new DDBDAOFactory()).follow(
            event.authToken,
            event.user
        ))
    );
    return response;
};
