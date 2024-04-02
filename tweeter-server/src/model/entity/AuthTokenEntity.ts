import { Entity } from "./Entity";

export class AuthTokenEntity extends Entity {
    token: string;
    timestamp: number;
    userHandle: string;

    constructor(token: string, timestamp: number, userHandle: string) {
        super();
        this.token = token;
        this.timestamp = timestamp;
        this.userHandle = userHandle;
    }
}
