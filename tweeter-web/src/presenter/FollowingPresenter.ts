import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export class FollowingPresenter extends UserItemPresenter {
    private service: FollowService;

    public constructor(view: UserItemView) {
        super(view);
        this.service = new FollowService();
    }

    public async loadMoreItems(
        authToken: AuthToken,
        user: User
    ): Promise<void> {
        this.doFailureReportingOperation(async () => {
            if (this.hasMoreItems) {
                let [newItems, hasMore] = await this.service.loadMoreFollowees(
                    authToken,
                    user,
                    PAGE_SIZE,
                    this.lastItem
                );

                this.hasMoreItems = hasMore;
                this.lastItem = newItems[newItems.length - 1];
                this.view.addItems(newItems);
            }
        }, "load followee items");
    }
}
