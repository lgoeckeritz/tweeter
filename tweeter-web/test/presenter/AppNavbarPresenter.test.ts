import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter } from "../../src/presenter/AppNavbarPresenter";
import { MessageView } from "../../src/presenter/Presenter";
import {
    anything,
    capture,
    instance,
    mock,
    spy,
    verify,
    when,
} from "ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarPresenterView: MessageView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockUserService: UserService;

    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockAppNavbarPresenterView = mock<MessageView>();
        const mockAppNavbarPresenterViewInstance = instance(
            mockAppNavbarPresenterView
        );

        const appNavbarPresenterSpy = spy(
            new AppNavbarPresenter(mockAppNavbarPresenterViewInstance)
        );
        appNavbarPresenter = instance(appNavbarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);

        when(appNavbarPresenterSpy.service).thenReturn(mockUserServiceInstance);
    });

    it("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(
            mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)
        ).once();
    });

    it("calls logout on the user service with the correct auth token", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockUserService.logout(authToken)).once();
    });

    it("tells the view to clear the last info mesage, clear the user info, and navigate to the login page when logout is successful", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarPresenterView.clearLastInfoMessage()).once();
        verify(mockAppNavbarPresenterView.clearUserInfo()).once();
        // TODO: Figure out how this is supposed to run because I don't have a navigate
        // verify(mockAppNavbarPresenterView.navigateToLogin()).once();

        verify(
            mockAppNavbarPresenterView.displayErrorMessage(anything())
        ).never();
    });

    it("displays an error message and does not clear the last info message, user info, or navigate to the login page when logout fails", async () => {
        const error = new Error("An error occured");
        when(mockUserService.logout(authToken)).thenThrow(error);

        // let [capturedErrorMessage] = capture(
        //     mockAppNavbarPresenterView.displayErrorMessage
        // ).last();
        // console.log(capturedErrorMessage);

        await appNavbarPresenter.logOut(authToken);

        verify(
            mockAppNavbarPresenterView.displayErrorMessage(
                "Failed to log user out because of exception: An error occured"
            )
        ).once();

        verify(mockAppNavbarPresenterView.clearLastInfoMessage()).never();
        verify(mockAppNavbarPresenterView.clearUserInfo()).never();
        // TODO: Figure out how this is supposed to run because I don't have a navigate
        // verify(mockAppNavbarPresenterView.navigateToLogin()).never();
    });
});
