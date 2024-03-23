import {
    LoadMoreStatusItemsRequest,
    LoadMoreStatusItemsResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (
    event: LoadMoreStatusItemsRequest
): Promise<LoadMoreStatusItemsResponse> => {
    if (event.user == null) {
        throw new Error("[Bad Request] requested user is null");
    }

    if (event.authToken == null) {
        throw new Error("[Bad Request] requested authToken is null");
    }

    if (event.pageSize == null) {
        throw new Error("[Bad Request] requested pageSize is null");
    }

    let response = new LoadMoreStatusItemsResponse(
        true,
        ...(await new StatusService().loadMoreFeedItems(
            event.authToken,
            event.user,
            event.pageSize,
            event.lastItem
        ))
    );

    if (response.hasMoreItems == null) {
        throw new Error("[Server Error] could not complete request");
    }

    if (response.pageOfStatuses == null) {
        throw new Error("[Server Error] could not complete request");
    }

    return response;
};
