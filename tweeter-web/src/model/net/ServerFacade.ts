import {
    AuthenticateResponse,
    LoginRequest,
    RegisterRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import {
    GetUserRequest,
    LogoutRequest,
} from "tweeter-shared/dist/model/net/Request";
import {
    GetUserResponse,
    TweeterResponse,
} from "tweeter-shared/dist/model/net/Response";

export class ServerFacade {
    private SERVER_URL =
        "https://gh82nug6qk.execute-api.us-east-1.amazonaws.com/dev";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    async getUser(request: GetUserRequest): Promise<GetUserResponse> {
        const endpoint = "/service/getUser";
        const response: JSON =
            await this.clientCommunicator.doPost<GetUserRequest>(
                request,
                endpoint
            );

        return GetUserResponse.fromJson(response);
    }

    async login(request: LoginRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/login";
        const response: JSON =
            await this.clientCommunicator.doPost<LoginRequest>(
                request,
                endpoint
            );

        return AuthenticateResponse.fromJson(response);
    }

    async register(request: RegisterRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/register";
        const response: JSON =
            await this.clientCommunicator.doPost<RegisterRequest>(
                request,
                endpoint
            );
        return AuthenticateResponse.fromJson(response);
    }

    async logout(request: LogoutRequest): Promise<TweeterResponse> {
        const endpoint = "/service/logout";
        const response: JSON =
            await this.clientCommunicator.doPost<LogoutRequest>(
                request,
                endpoint
            );
        return TweeterResponse.fromJson(response);
    }
}
