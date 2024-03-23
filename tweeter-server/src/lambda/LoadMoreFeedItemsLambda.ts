import {
    LoadMoreStatusItemsRequest,
    LoadMoreStatusItemsResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (
    event: LoadMoreStatusItemsRequest
): Promise<LoadMoreStatusItemsResponse> => {
    console.log(event.lastItem);
    let response = new LoadMoreStatusItemsResponse(
        true,
        ...(await new StatusService().loadMoreFeedItems(
            event.authToken,
            event.user,
            event.pageSize,
            event.lastItem
        ))
    );
    return response;
};
