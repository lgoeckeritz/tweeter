import {
    AuthToken,
    User,
    FakeData,
    LoginRequest,
    AuthenticateResponse,
} from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../net/ServerFacade";

export class UserService {
    private serverFacade = new ServerFacade();

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        let authResponse: AuthenticateResponse = await this.serverFacade.login(
            new LoginRequest(alias, password)
        );

        return [authResponse.user, authResponse.token];
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array
    ): Promise<[User, AuthToken]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        let imageStringBase64: string =
            Buffer.from(userImageBytes).toString("base64");

        // TODO: Replace with the result of calling the server
        let user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid registration");
        }

        return [user, FakeData.instance.authToken];
    }

    public async logout(authToken: AuthToken): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
    }
}
