import {
    AuthenticateResponse,
    LoginRequest,
    RegisterRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
    private SERVER_URL =
        "https://gh82nug6qk.execute-api.us-east-1.amazonaws.com/dev";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

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
}
