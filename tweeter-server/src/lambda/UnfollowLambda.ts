import { FollowInfoRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";

export const handler = async (
    event: FollowInfoRequest
): Promise<TweeterResponse> => {
    if (event.user == null) {
        throw new Error("[Bad Request] requested user is null");
    }

    if (event.authToken == null) {
        throw new Error("[Bad Request] requested authToken is null");
    }

    let response = new TweeterResponse(true);
    return response;
};
