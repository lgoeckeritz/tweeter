import { PostStatusRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";

export const handler = async (
    event: PostStatusRequest
): Promise<TweeterResponse> => {
    if (event.newStatus == null) {
        throw new Error("[Bad Request] requested newStatus is null");
    }

    if (event.authToken == null) {
        throw new Error("[Bad Request] requested authToken is null");
    }
    let response = new TweeterResponse(true);
    return response;
};
