import { AuthToken, Status, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View {
    addItems: (items: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
    private _hasMoreItems: boolean = true;
    private _lastItem: Status | null = null;

    protected constructor(view: StatusItemView) {
        super(view);
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    public get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(value: Status | null) {
        this._lastItem = value;
    }

    public abstract loadMoreItems(
        authToken: AuthToken,
        displayedUser: User
    ): void;
}
