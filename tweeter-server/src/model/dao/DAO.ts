import { Entity } from "../entity/Entity";

export interface DAO<T extends Entity> {
    recordItem(entity: T): Promise<void>;
    putItem(entity: T): Promise<void>;
    updateItem(entity: T): Promise<void>;
    getItem(entity: T): Promise<T | undefined>;
    deleteItem(entity: T): Promise<void>;
}
