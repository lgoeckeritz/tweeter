import {
    GetIsFollowerStatusRequest,
    GetIsFollowerStatusResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DDBDAOFactory } from "../model/dao/DynamoDB/DDBDAOFactory";

export const handler = async (
    event: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {
    const request: GetIsFollowerStatusRequest =
        GetIsFollowerStatusRequest.fromJson(event);
    let response = new GetIsFollowerStatusResponse(
        true,
        await new FollowService(new DDBDAOFactory()).getIsFollowerStatus(
            request.authToken,
            request.user,
            request.selectedUser
        )
    );
    return response;
};
