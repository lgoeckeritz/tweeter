import { UserEntity } from "../../entity/UserEntity";
import { UsersDAO } from "../interface/UsersDAO";

export class DDBUsersDAO implements UsersDAO {
    loginUser(alias: string, password: string): Promise<UserEntity | null> {
        throw new Error("Method not implemented.");
    }
    registerUser(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageUrl: string
    ): Promise<UserEntity | null> {
        throw new Error("Method not implemented.");
    }
    getUser(userHandle: string): Promise<UserEntity | null> {
        throw new Error("Method not implemented.");
    }
}
