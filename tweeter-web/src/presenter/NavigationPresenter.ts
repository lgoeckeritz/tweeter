import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface NavigationView {
    setDisplayedUser: (user: User) => void;
    displayErrorMessage: (message: string) => void;
}

export class NavigationPresenter {
    private service: UserService;
    private view: NavigationView;

    public constructor(view: NavigationView) {
        this.view = view;
        this.service = new UserService();
    }

    public async loadUser(
        event: React.MouseEvent,
        authToken: AuthToken,
        currentUser: User
    ) {
        try {
            let alias = this.extractAlias(event.target.toString());

            let user = await this.service.getUser(authToken!, alias);

            if (!!user) {
                if (currentUser!.equals(user)) {
                    this.view.setDisplayedUser(currentUser!);
                } else {
                    this.view.setDisplayedUser(user);
                }
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get user because of exception: ${error}`
            );
        }
    }

    public extractAlias(value: string): string {
        let index = value.indexOf("@");
        return value.substring(index);
    }
}
