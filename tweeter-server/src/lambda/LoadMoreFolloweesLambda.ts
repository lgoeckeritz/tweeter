import {
    LoadMoreUserItemsRequest,
    LoadMoreUserItemsResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
    event: LoadMoreUserItemsRequest
): Promise<LoadMoreUserItemsResponse> => {
    let response = new LoadMoreUserItemsResponse(
        true,
        ...(await new FollowService().loadMoreFollowees(
            event.authToken,
            event.user,
            event.pageSize,
            event.lastItem
        ))
    );
    return response;
};
