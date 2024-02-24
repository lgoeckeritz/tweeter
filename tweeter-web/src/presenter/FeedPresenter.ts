import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter {
    private service: StatusService;

    public constructor(view: StatusItemView) {
        super(view);
        this.service = new StatusService();
    }

    public async loadMoreItems(
        authToken: AuthToken,
        user: User
    ): Promise<void> {
        this.doFailureReportingOperation(async () => {
            if (this.hasMoreItems) {
                let [newItems, hasMore] = await this.service.loadMoreFeedItems(
                    authToken,
                    user,
                    PAGE_SIZE,
                    this.lastItem
                );

                this.hasMoreItems = hasMore;
                this.lastItem = newItems[newItems.length - 1];
                this.view.addItems(newItems);
            }
        }, "load feed items");
    }
}
