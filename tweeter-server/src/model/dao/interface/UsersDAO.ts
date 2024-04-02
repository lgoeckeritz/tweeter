import { User } from "tweeter-shared";

export interface UsersDAO {
    loginUser(alias: string, password: string): Promise<User | null>;
    registerUser(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageUrl: string
    ): Promise<User | null>;
    getUser(userHandle: string): Promise<User | null>;
}
