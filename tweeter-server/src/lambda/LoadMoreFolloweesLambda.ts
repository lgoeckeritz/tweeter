import {
    LoadMoreUserItemsRequest,
    LoadMoreUserItemsResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DDBDAOFactory } from "../model/dao/DynamoDB/DDBDAOFactory";

export const handler = async (
    event: LoadMoreUserItemsRequest
): Promise<LoadMoreUserItemsResponse> => {
    let response = new LoadMoreUserItemsResponse(
        true,
        ...(await new FollowService(new DDBDAOFactory()).loadMoreFollowees(
            event.authToken,
            event.user,
            event.pageSize,
            event.lastItem
        ))
    );
    return response;
};
