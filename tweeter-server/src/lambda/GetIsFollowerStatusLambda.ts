import {
    GetIsFollowerStatusRequest,
    GetIsFollowerStatusResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
    event: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {
    if (event.user == null) {
        throw new Error("[Bad Request] requested user is null");
    }

    if (event.authToken == null) {
        throw new Error("[Bad Request] requested authToken is null");
    }

    if (event.selectedUser == null) {
        throw new Error("[Bad Request] requested selectedUser is null");
    }

    let response = new GetIsFollowerStatusResponse(
        true,
        await new FollowService().getIsFollowerStatus(
            event.authToken,
            event.user,
            event.selectedUser
        )
    );

    if (response.isFollower == null) {
        throw new Error("[Server Error] could not complete request");
    }

    return response;
};
