import { User, AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/interface/AuthTokenDAO";
import { DAOFactory } from "../dao/interface/DAOFactory";
import { UsersDAO } from "../dao/interface/UsersDAO";
import { ImageDAO } from "../dao/interface/ImageDAO";

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
        const authenticated: boolean = await this.authTokenDAO.authenticate(
            authToken.token
        );

        if (authenticated) {
            return this.usersDAO.getUser(alias);
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
        const user = await this.usersDAO.loginUser(alias, password);
        if (user !== null) {
            //generate and store authToken
            const authToken: AuthToken = AuthToken.Generate();
            this.authTokenDAO.recordAuthToken(authToken, alias);

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
        //converting image string to image url
        const imageUrl = await this.imageDAO.putImage(alias, imageStringBase64);

        const user = await this.usersDAO.registerUser(
            firstName,
            lastName,
            alias,
            password,
            imageUrl
        );
        if (user !== null) {
            //generate and store authToken
            const authToken: AuthToken = AuthToken.Generate();
            this.authTokenDAO.recordAuthToken(authToken, alias);

            return [user, authToken];
        } else {
            throw new Error("[Forbidden Error] Invalid registration");
        }
    }

    public async logout(authToken: AuthToken): Promise<void> {
        await this.authTokenDAO.deleteAuthToken(authToken.token);
    }
}
