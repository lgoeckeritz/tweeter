import { UserEntity } from "../../entity/UserEntity";
export interface UsersDAO {
    loginUser(alias: string, password: string): Promise<UserEntity | null>;
    registerUser(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageUrl: string
    ): Promise<UserEntity | null>;
    getUser(userHandle: string): Promise<UserEntity | null>;
}
