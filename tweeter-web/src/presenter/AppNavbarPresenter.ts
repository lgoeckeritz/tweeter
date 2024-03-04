import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export class AppNavbarPresenter extends Presenter<MessageView> {
    private _service: UserService;

    public constructor(view: MessageView) {
        super(view);
        this._service = new UserService();
    }

    public get service(): UserService {
        return this._service;
    }

    public async logOut(authToken: AuthToken) {
        this.view.displayInfoMessage("Logging Out...", 0);
        this.doFailureReportingOperation(async () => {
            await this.service.logout(authToken!);
            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
            //TODO: should this have a navigateToLogin?
        }, "log user out");
    }
}
