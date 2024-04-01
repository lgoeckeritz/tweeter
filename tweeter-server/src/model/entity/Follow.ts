import { Entity } from "./Entity";

export class Follow extends Entity {
    followerHandle: string;
    followerName: string;
    followeeHandle: string;
    followeeName: string;

    constructor(
        followerHandle: string,
        followerName: string,
        followeeHandle: string,
        followeeName: string
    ) {
        super();
        this.followerHandle = followerHandle;
        this.followerName = followerName;
        this.followeeHandle = followeeHandle;
        this.followeeName = followeeName;
    }

    toString(): string {
        return (
            "Follow{" +
            "follower handle='" +
            this.followerHandle +
            "'" +
            ", follower name='" +
            this.followerName +
            "'" +
            ", followee handle='" +
            this.followeeHandle +
            "'" +
            ", followee name='" +
            this.followeeName +
            "'}"
        );
    }
}
