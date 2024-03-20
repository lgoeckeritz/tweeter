import { FollowDto } from "../dto/FollowDto";
import { User } from "./User";

export class Follow {
    private _follower: User;
    private _followee: User;

    public constructor(follower: User, followee: User) {
        this._follower = follower;
        this._followee = followee;
    }

    public get follower(): User {
        return this._follower;
    }

    public set follower(value: User) {
        this._follower = value;
    }

    public get followee(): User {
        return this._followee;
    }

    public set followee(value: User) {
        this._followee = value;
    }

    public static fromDto(dto: FollowDto | null | undefined): Follow | null {
        return dto ? new Follow(dto.follower, dto.followee) : null;
    }

    public get dto(): FollowDto {
        return {
            follower: this.follower,
            followee: this.followee,
        };
    }
}
