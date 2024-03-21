import { LogoutRequest } from "tweeter-shared/dist/model/net/Request";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";

export const handler = async (
    event: LogoutRequest
): Promise<TweeterResponse> => {
    let response = new TweeterResponse(true);
    return response;
};
