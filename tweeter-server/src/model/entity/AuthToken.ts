export class AuthToken {
    token: string;
    timestamp: number;

    constructor(token: string, timestamp: number) {
        this.token = token;
        this.timestamp = timestamp;
    }
}
