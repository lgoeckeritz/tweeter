import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class LoginLambda {
    handler = async (event: LoginRequest): Promise<AuthenticateResponse> => {
        let response = new AuthenticateResponse(
            ...(await new UserService().login(event.username, event.password))
        );
        return response;
    };
}
