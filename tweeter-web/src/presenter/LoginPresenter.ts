import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateFunction } from "react-router-dom";

export interface LoginView {
    displayErrorMessage: (message: string) => void;
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
    navigate: NavigateFunction;
}

export class LoginPresenter {
    private service: UserService;
    private view: LoginView;

    public constructor(view: LoginView) {
        this.view = view;
        this.service = new UserService();
    }

    public async doLogin(
        alias: string,
        password: string,
        rememberMeRef: React.MutableRefObject<boolean>,
        originalUrl: string | undefined
    ) {
        try {
            let [user, authToken] = await this.service.login(alias, password);

            this.view.updateUserInfo(
                user,
                user,
                authToken,
                rememberMeRef.current
            );

            if (!!originalUrl) {
                this.view.navigate(originalUrl);
            } else {
                this.view.navigate("/");
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        }
    }
}
