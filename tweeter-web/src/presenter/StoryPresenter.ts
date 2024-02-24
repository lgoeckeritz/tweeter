import { AuthToken, Status, User } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
    protected async getMoreItems(
        authToken: AuthToken,
        user: User
    ): Promise<[Status[], boolean]> {
        return this.service.loadMoreFeedItems(
            authToken,
            user,
            PAGE_SIZE,
            this.lastItem
        );
    }
    protected getItemDescription(): string {
        return "load story items";
    }
}
