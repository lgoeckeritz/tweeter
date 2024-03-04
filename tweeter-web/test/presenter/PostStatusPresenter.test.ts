import { AuthToken, Status, User } from "tweeter-shared";
import {
    PostStatusPresenter,
    PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import {
    anything,
    capture,
    instance,
    mock,
    spy,
    verify,
    when,
} from "ts-mockito";
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
    let mockPostStatusPresenterView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;

    const authToken = new AuthToken("abc123", Date.now());
    const user = new User("firstName", "lastName", "alias", "");
    //since they're doing Date.now() it won't be equal so this won't be used
    const status = new Status("test", user, Date.now());

    beforeEach(() => {
        mockPostStatusPresenterView = mock<PostStatusView>();
        const mockPostStatusPresenterInstance = instance(
            mockPostStatusPresenterView
        );

        const postStatusPresenterSpy = spy(
            new PostStatusPresenter(mockPostStatusPresenterInstance)
        );
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);

        when(postStatusPresenterSpy.service).thenReturn(
            mockStatusServiceInstance
        );
    });

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost("", user, authToken);
        verify(
            mockPostStatusPresenterView.displayInfoMessage(
                "Posting status...",
                0
            )
        ).once();
    });

    it("calls postStatus on the status service with the correct status string and auth token", async () => {
        await postStatusPresenter.submitPost("test", user, authToken);
        verify(mockStatusService.postStatus(authToken, anything())).once();

        // checking for correct status string
        let [capturedAuthtoken, capturedStatus] = capture(
            mockStatusService.postStatus
        ).last();
        expect(capturedStatus.post).toEqual("test");
    });

    it("tells the view to clear the last info message, clear the post, and display a status posted message when submit post is successful", async () => {
        await postStatusPresenter.submitPost("test", user, authToken);
        verify(mockPostStatusPresenterView.clearLastInfoMessage()).once();
        verify(mockPostStatusPresenterView.setPost("")).once();
        verify(
            mockPostStatusPresenterView.displayInfoMessage(
                "Status posted!",
                2000
            )
        ).once();

        verify(
            mockPostStatusPresenterView.displayErrorMessage(anything())
        ).never();
    });

    it("displays an error message and does not clear the last info message, user post, or display a status posted message when submit post fails", async () => {
        const error = new Error("An error occured");
        when(mockStatusService.postStatus(authToken, anything())).thenThrow(
            error
        );

        await postStatusPresenter.submitPost("test", user, authToken);

        verify(
            mockPostStatusPresenterView.displayErrorMessage(
                "Failed to post the status because of exception: An error occured"
            )
        ).once();

        verify(mockPostStatusPresenterView.clearLastInfoMessage()).never();
        verify(mockPostStatusPresenterView.setPost("")).never();
        verify(
            mockPostStatusPresenterView.displayInfoMessage(
                "Status posted!",
                2000
            )
        ).never();
    });
});
