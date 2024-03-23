import {
    LoadMoreUserItemsRequest,
    LoadMoreUserItemsResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
    event: LoadMoreUserItemsRequest
): Promise<LoadMoreUserItemsResponse> => {
    if (event.user == null) {
        throw new Error("[Bad Request] requested user is null");
    }

    if (event.authToken == null) {
        throw new Error("[Bad Request] requested authToken is null");
    }

    if (event.pageSize == null) {
        throw new Error("[Bad Request] requested pageSize is null");
    }

    let response = new LoadMoreUserItemsResponse(
        true,
        ...(await new FollowService().loadMoreFollowers(
            event.authToken,
            event.user,
            event.pageSize,
            event.lastItem
        ))
    );

    if (response.hasMoreItems == null) {
        throw new Error("[Server Error] could not complete request");
    }
    if (response.pageOfUsers == null) {
        throw new Error("[Server Error] could not complete request");
    }
    return response;
};
