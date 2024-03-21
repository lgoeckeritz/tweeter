import { FollowInfoRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
    event: FollowInfoRequest
): Promise<GetFollowCountResponse> => {
    let response = new GetFollowCountResponse(
        true,
        await new FollowService().getFolloweesCount(event.authToken, event.user)
    );
    return response;
};
