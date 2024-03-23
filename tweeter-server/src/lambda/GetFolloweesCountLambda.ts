import { FollowInfoRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
    event: FollowInfoRequest
): Promise<GetFollowCountResponse> => {
    if (event.user == null) {
        throw new Error("[Bad Request] requested user is null");
    }

    if (event.authToken == null) {
        throw new Error("[Bad Request] requested authToken is null");
    }

    let response = new GetFollowCountResponse(
        true,
        await new FollowService().getFolloweesCount(event.authToken, event.user)
    );

    if (response.count == null) {
        throw new Error("[Server Error] could not complete request");
    }

    return response;
};
