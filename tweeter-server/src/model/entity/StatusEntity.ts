import { Entity } from "./Entity";

export class StatusEntity extends Entity {
    handle: string;
    timestamp: number;
    statusJson: string;

    constructor(handle: string, timestamp: number, statusJson: string) {
        super();
        this.handle = handle;
        this.timestamp = timestamp;
        this.statusJson = statusJson;
    }
}
