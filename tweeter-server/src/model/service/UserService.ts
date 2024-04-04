import { User, AuthToken } from "tweeter-shared";
import { DAOFactory } from "../dao/interface/DAOFactory";
import { UserEntity } from "../entity/UserEntity";
import { AuthTokenEntity } from "../entity/AuthTokenEntity";
import { Service } from "./Service";

export class UserService extends Service {
    constructor(daoFactory: DAOFactory) {
        super(daoFactory);
    }

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        this.verfiyRequestData([authToken, alias]);
        this.authenticate(authToken.token);

        const userEntity: UserEntity | undefined = await this.usersDAO.getUser(
            alias
        );
        this.verifyReturn(userEntity);
        return new User(
            userEntity!.firstName,
            userEntity!.lastName,
            userEntity!.alias,
            userEntity!.imageUrl
        );
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        this.verfiyRequestData([alias, password]);

        const userEntity: UserEntity | undefined =
            await this.usersDAO.loginUser(alias, password);
        if (userEntity !== undefined) {
            return await this.returnUserToken(userEntity, alias);
        } else {
            throw new Error("[Forbidden Error] Invalid alias or password");
        }
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageStringBase64: string
    ): Promise<[User, AuthToken]> {
        this.verfiyRequestData([
            firstName,
            lastName,
            alias,
            password,
            imageStringBase64,
        ]);

        //converting image string to image url
        const imageUrl = await this.imageDAO.putImage(alias, imageStringBase64);

        const userEntity: UserEntity | undefined =
            await this.usersDAO.registerUser(
                firstName,
                lastName,
                alias,
                password,
                imageUrl
            );
        if (userEntity !== undefined) {
            return await this.returnUserToken(userEntity, alias);
        } else {
            throw new Error("[Forbidden Error] Invalid registration");
        }
    }

    public async logout(authToken: AuthToken): Promise<void> {
        await this.authTokenDAO.deleteAuthToken(authToken.token);
    }

    private async returnUserToken(
        userEntity: UserEntity,
        alias: string
    ): Promise<[User, AuthToken]> {
        //generate and store authToken
        const authToken: AuthToken = AuthToken.Generate();
        await this.authTokenDAO.recordAuthToken(
            new AuthTokenEntity(authToken.token, authToken.timestamp, alias)
        );

        //generating user from userEntity
        const user = new User(
            userEntity.firstName,
            userEntity.lastName,
            userEntity.alias,
            userEntity.imageUrl
        );

        return [user, authToken];
    }
}
