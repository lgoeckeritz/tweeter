import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface UserItemView extends View {
    addItems: (items: User[]) => void;
}

export abstract class UserItemPresenter extends Presenter<UserItemView> {
    private _hasMoreItems: boolean = true;
    private _lastItem: User | null = null;

    protected constructor(view: UserItemView) {
        super(view);
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(user: User | null) {
        this._lastItem = user;
    }

    public abstract loadMoreItems(
        authToken: AuthToken,
        displayedUser: User
    ): void;
}
