import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AuthenticationView extends View {
    authenticated: (user: User, authToken: AuthToken) => void;
    navigateTo: (url: string) => void;
}

export class Authentication<T extends AuthenticationView> extends Presenter<T> {
    private _service: UserService;

    public constructor(view: T) {
        super(view);
        this._service = new UserService();
    }

    protected get service(): UserService {
        return this._service;
    }

    protected async doAuthenticateNavigate(
        operation: () => Promise<void>
    ): Promise<void> {
        await operation();
    }
}
