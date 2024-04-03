import { UserEntity } from "../../entity/UserEntity";
export interface UsersDAO {
    loginUser(alias: string, password: string): Promise<UserEntity | undefined>;
    registerUser(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageUrl: string
    ): Promise<UserEntity | undefined>;
    getUser(userHandle: string): Promise<UserEntity | undefined>;
}
