import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private service: StatusService;

    public constructor(view: PostStatusView) {
        super(view);
        this.service = new StatusService();
    }

    public async submitPost(
        post: string,
        currentUser: User,
        authToken: AuthToken,
        setPost: React.Dispatch<React.SetStateAction<string>>
    ) {
        this.doFailureReportingOperation(async () => {
            this.view.displayInfoMessage("Posting status...", 0);

            let status = new Status(post, currentUser!, Date.now());

            await this.service.postStatus(authToken!, status);

            this.view.clearLastInfoMessage();
            setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        }, "post the status");
    }
}
