import { FollowInfoRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";

export const handler = async (
    event: FollowInfoRequest
): Promise<TweeterResponse> => {
    let response = new TweeterResponse(true);
    return response;
};
