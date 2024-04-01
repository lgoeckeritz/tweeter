import { Entity } from "./Entity";

export class AuthToken extends Entity {
    token: string;
    timestamp: number;

    constructor(token: string, timestamp: number) {
        super();
        this.token = token;
        this.timestamp = timestamp;
    }
}
