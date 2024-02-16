import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface UserInfoView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
    setIsFollower: React.Dispatch<React.SetStateAction<boolean>>;
    setFolloweesCount: (value: React.SetStateAction<number>) => void;
    setFollowersCount: React.Dispatch<React.SetStateAction<number>>;
}

export class UserInfoPresenter {
    private service: FollowService;
    private view: UserInfoView;

    public constructor(view: UserInfoView) {
        this.view = view;
        this.service = new FollowService();
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        try {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.service.getIsFollowerStatus(
                        authToken!,
                        currentUser!,
                        displayedUser!
                    )
                );
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to determine follower status because of exception: ${error}`
            );
        }
    }

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        try {
            this.view.setFolloweesCount(
                await this.service.getFolloweesCount(authToken, displayedUser)
            );
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get followees count because of exception: ${error}`
            );
        }
    }

    public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
        try {
            this.view.setFollowersCount(
                await this.service.getFollowersCount(authToken, displayedUser)
            );
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get followers count because of exception: ${error}`
            );
        }
    }

    public async followDisplayedUser(
        displayedUser: User,
        authToken: AuthToken
    ): Promise<void> {
        try {
            this.view.displayInfoMessage(
                `Adding ${displayedUser!.name} to followers...`,
                0
            );

            let [followersCount, followeesCount] = await this.service.follow(
                authToken!,
                displayedUser!
            );

            this.view.clearLastInfoMessage();

            this.view.setIsFollower(true);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to follow user because of exception: ${error}`
            );
        }
    }

    public async unfollowDisplayedUser(
        displayedUser: User,
        authToken: AuthToken
    ): Promise<void> {
        try {
            this.view.displayInfoMessage(
                `Removing ${displayedUser!.name} from followers...`,
                0
            );

            let [followersCount, followeesCount] = await this.service.unfollow(
                authToken!,
                displayedUser!
            );

            this.view.clearLastInfoMessage();

            this.view.setIsFollower(false);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to unfollow user because of exception: ${error}`
            );
        }
    }
}
