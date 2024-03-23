import { LogoutRequest } from "tweeter-shared/dist/model/net/Request";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";

export const handler = async (
    event: LogoutRequest
): Promise<TweeterResponse> => {
    if (event.token == null) {
        throw new Error("[Bad Request] requested token is null");
    }

    let response = new TweeterResponse(true);
    return response;
};
