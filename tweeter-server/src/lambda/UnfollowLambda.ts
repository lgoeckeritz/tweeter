import { FollowInfoRequest, GetFollowInfoResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DDBDAOFactory } from "../model/dao/DynamoDB/DDBDAOFactory";

export const handler = async (
    event: FollowInfoRequest
): Promise<GetFollowInfoResponse> => {
    const request: FollowInfoRequest = FollowInfoRequest.fromJson(event);
    let response = new GetFollowInfoResponse(
        true,
        ...(await new FollowService(new DDBDAOFactory()).unfollow(
            request.authToken,
            request.user
        ))
    );
    return response;
};
