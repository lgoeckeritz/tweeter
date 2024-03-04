import { render, screen } from "@testing-library/react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import { AuthToken, User } from "tweeter-shared";
import {
    anything,
    capture,
    instance,
    mock,
    spy,
    verify,
    when,
} from "ts-mockito";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
}));

describe("PostStatus Component", () => {
    //todo: idk what I'm doing here
    let useUserInfo: jest.Mock<any, any, any>;
    let mockUser: User;
    let mockAuthToken: AuthToken;

    mockUser = mock<User>();
    let mockUserInstance = instance(mockUser);

    mockAuthToken = mock<AuthToken>();
    let mockAuthTokenInstance = instance(mockAuthToken);

    beforeAll(() => {
        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
        });
    });

    it("starts with both Post Status and Clear buttons disabled", () => {
        const { postStatusButton, clearStatusButton } =
            renderPostStatusAndGetElements();
        expect(postStatusButton).toBeDisabled();
        expect(clearStatusButton).toBeDisabled();
    });

    it("enables both buttons when text field has text", async () => {
        const { postStatusButton, clearStatusButton, postText, user } =
            renderPostStatusAndGetElements();

        await user.type(postText, "a");
        expect(postStatusButton).toBeEnabled();
        expect(clearStatusButton).toBeEnabled();
    });

    it("disabled both buttons when the text field is cleared", async () => {
        const { postStatusButton, clearStatusButton, postText, user } =
            renderPostStatusAndGetElements();

        expect(postStatusButton).toBeDisabled();
        expect(clearStatusButton).toBeDisabled();

        await user.type(postText, "a");
        expect(postStatusButton).toBeEnabled();
        expect(clearStatusButton).toBeEnabled();

        await user.clear(postText);
        expect(postStatusButton).toBeEnabled();
        expect(clearStatusButton).toBeEnabled();
    });

    it("calls the presenters postStatus method when the Post Status button is pressed", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        const post: string = "test";

        const { postStatusButton, postText, user } =
            renderPostStatusAndGetElements(mockPresenterInstance);

        await user.type(postText, post);
        await user.click(postStatusButton);

        verify(
            mockPresenter.submitPost(
                post,
                mockUserInstance, //todo: make sure this is the right thing to be passed
                mockAuthTokenInstance //todo: make sure this is the right thing to be passed
            )
        ).once();
    });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <PostStatus presenter={presenter} />
            ) : (
                <PostStatus />
            )}
        </MemoryRouter>
    );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
    const user = userEvent.setup();

    renderPostStatus(presenter);

    const postStatusButton = screen.getByRole("button", {
        name: /Post Status/i,
    });
    const clearStatusButton = screen.getByRole("button", { name: /Clear/i });
    const postText = screen.getByLabelText("post");

    return { postStatusButton, clearStatusButton, postText, user };
};
