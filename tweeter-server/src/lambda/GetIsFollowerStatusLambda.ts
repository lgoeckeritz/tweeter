import {
    GetIsFollowerStatusRequest,
    GetIsFollowerStatusResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
    event: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {
    let response = new GetIsFollowerStatusResponse(
        true,
        await new FollowService().getIsFollowerStatus(
            event.authToken,
            event.user,
            event.selectedUser
        )
    );
    return response;
};
