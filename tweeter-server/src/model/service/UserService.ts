import { User, AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/interface/AuthTokenDAO";
import { DAOFactory } from "../dao/interface/DAOFactory";
import { UsersDAO } from "../dao/interface/UsersDAO";
import { ImageDAO } from "../dao/interface/ImageDAO";
import { UserEntity } from "../entity/UserEntity";
import { AuthTokenEntity } from "../entity/AuthTokenEntity";

export class UserService {
    private authTokenDAO: AuthTokenDAO;
    private usersDAO: UsersDAO;
    private imageDAO: ImageDAO;

    constructor(daoFactory: DAOFactory) {
        this.authTokenDAO = daoFactory.getAuthTokensDAO();
        this.usersDAO = daoFactory.getUsersDAO();
        this.imageDAO = daoFactory.getImageDAO();
    }

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        //checking to make sure request is good
        if (authToken === null || alias === null) {
            throw new Error("[Bad Request] part or all of the request is null");
        }

        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
            const userEntity: UserEntity | undefined =
                await this.usersDAO.getUser(alias);
            if (userEntity !== undefined) {
                return new User(
                    userEntity.firstName,
                    userEntity.lastName,
                    userEntity.alias,
                    userEntity.imageUrl
                );
            } else {
                return null;
            }
        } else {
            throw new Error(
                "[Forbidden Error] authtoken either doesn't exist or is timed out"
            );
        }
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        //checking to make sure request is good
        if (password === null || alias === null) {
            throw new Error("[Bad Request] part or all of the request is null");
        }

        const userEntity: UserEntity | undefined =
            await this.usersDAO.loginUser(alias, password);
        if (userEntity !== undefined) {
            //generate and store authToken
            const authToken: AuthToken = AuthToken.Generate();
            this.authTokenDAO.recordAuthToken(
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
        //checking to make sure request is good
        if (
            firstName === null ||
            lastName === null ||
            alias === null ||
            password === null ||
            imageStringBase64 === null
        ) {
            throw new Error("[Bad Request] part or all of the request is null");
        }

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
        } else {
            throw new Error("[Forbidden Error] Invalid registration");
        }
    }

    public async logout(authToken: AuthToken): Promise<void> {
        await this.authTokenDAO.deleteAuthToken(authToken.token);
    }
}
