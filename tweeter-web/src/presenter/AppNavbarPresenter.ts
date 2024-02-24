import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

// export interface AppNavbarView extends MessageView {
//     displayInfoMessage: (message: string, duration: number) => void;
// }

// THIS SERVICE MAY WANT TO BE A STATUS SERVICE INSTEAD OF THE USER SERVICE
export class AppNavbarPresenter extends Presenter<MessageView> {
    private service: UserService;

    public constructor(view: MessageView) {
        super(view);
        this.service = new UserService();
    }

    public async logOut(authToken: AuthToken) {
        this.doFailureReportingOperation(async () => {
            this.view.displayInfoMessage("Logging Out...", 0);
            await this.service.logout(authToken!);
            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
        }, "log user out");
    }
}
