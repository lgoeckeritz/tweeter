import { AuthToken, User } from "tweeter-shared";

export interface View {
    displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
    clearLastInfoMessage: () => void;
    clearUserInfo: () => void;
    displayInfoMessage: (message: string, duration: number) => void;
}

export interface AuthenticationView extends View {
    authenticated: (user: User, authToken: AuthToken) => void;
    navigateTo: (url: string) => void;
}

export class Presenter<T extends View> {
    private _view: T;

    protected constructor(view: T) {
        this._view = view;
    }

    protected get view(): T {
        return this._view;
    }

    protected async doFailureReportingOperation(
        operation: () => Promise<void>,
        operationDescription: string
    ): Promise<void> {
        try {
            await operation();
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to ${operationDescription} because of exception: ${error}`
            );
        }
    }
}
