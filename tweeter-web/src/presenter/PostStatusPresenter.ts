import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
}

export class PostStatusPreventer {
    private service: StatusService;
    private view: PostStatusView;

    public constructor(view: PostStatusView) {
        this.view = view;
        this.service = new StatusService();
    }

    public async submitPost(
        post: string,
        currentUser: User,
        authToken: AuthToken,
        setPost: React.Dispatch<React.SetStateAction<string>>
    ) {
        try {
            this.view.displayInfoMessage("Posting status...", 0);

            let status = new Status(post, currentUser!, Date.now());

            await this.service.postStatus(authToken!, status);

            this.view.clearLastInfoMessage();
            setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to post the status because of exception: ${error}`
            );
        }
    }
}
