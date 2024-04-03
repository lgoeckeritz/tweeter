import { PostStatusRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";
import { DDBDAOFactory } from "../model/dao/DynamoDB/DDBDAOFactory";

export const handler = async (
    event: PostStatusRequest
): Promise<TweeterResponse> => {
    await new StatusService(new DDBDAOFactory()).postStatus(
        event.authToken,
        event.newStatus
    );
    let response = new TweeterResponse(true);
    return response;
};
