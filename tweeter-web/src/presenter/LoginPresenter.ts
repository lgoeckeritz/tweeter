import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { AuthenticationView, Presenter } from "./Presenter";

// export interface LoginView {
//     displayErrorMessage: (message: string) => void;
//     authenticated: (user: User, authToken: AuthToken) => void;
//     navigateTo: (url: string) => void;
// }

export class LoginPresenter extends Presenter<AuthenticationView> {
    private service: UserService;

    public constructor(view: AuthenticationView) {
        super(view);
        this.service = new UserService();
    }

    public async doLogin(
        alias: string,
        password: string,
        originalUrl: string | undefined
    ) {
        this.doFailureReportingOperation(async () => {
            let [user, authToken] = await this.service.login(alias, password);

            this.view.authenticated(user, authToken);

            if (!!originalUrl) {
                this.view.navigateTo(originalUrl);
            } else {
                this.view.navigateTo("/");
            }
        }, "log user in");
    }
}
