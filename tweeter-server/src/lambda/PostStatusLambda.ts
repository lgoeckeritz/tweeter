import { PostStatusRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";
import { DDBDAOFactory } from "../model/dao/DynamoDB/DDBDAOFactory";

export const handler = async (
    event: PostStatusRequest
): Promise<TweeterResponse> => {
    const request: PostStatusRequest = PostStatusRequest.fromJson(event);
    await new StatusService(new DDBDAOFactory()).postStatus(
        request.authToken,
        request.newStatus
    );
    let response = new TweeterResponse(true);
    return response;
};
