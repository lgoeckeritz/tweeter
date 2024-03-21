import {
    LoadMoreStatusItemsRequest,
    LoadMoreStatusItemsResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (
    event: LoadMoreStatusItemsRequest
): Promise<LoadMoreStatusItemsResponse> => {
    let response = new LoadMoreStatusItemsResponse(
        true,
        ...(await new StatusService().loadMoreStoryItems(
            event.authToken,
            event.user,
            event.pageSize,
            event.lastItem
        ))
    );
    return response;
};
