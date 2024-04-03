import {
    GetIsFollowerStatusRequest,
    GetIsFollowerStatusResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DDBDAOFactory } from "../model/dao/DynamoDB/DDBDAOFactory";

export const handler = async (
    event: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {
    let response = new GetIsFollowerStatusResponse(
        true,
        await new FollowService(new DDBDAOFactory()).getIsFollowerStatus(
            event.authToken,
            event.user,
            event.selectedUser
        )
    );
    return response;
};
