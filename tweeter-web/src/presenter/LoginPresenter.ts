import { Authentication } from "./Authentication";
import { AuthenticationView } from "./Presenter";

export class LoginPresenter extends Authentication<AuthenticationView> {
    public constructor(view: AuthenticationView) {
        super(view);
    }

    public async doLogin(
        alias: string,
        password: string,
        originalUrl: string | undefined
    ) {
        this.doFailureReportingOperation(async () => {
            this.doAuthenticateNavigate(async () => {
                let [user, authToken] = await this.service.login(
                    alias,
                    password
                );

                this.view.authenticated(user, authToken);

                if (!!originalUrl) {
                    this.view.navigateTo(originalUrl);
                } else {
                    this.view.navigateTo("/");
                }
            });
        }, "log user in");
    }
}
