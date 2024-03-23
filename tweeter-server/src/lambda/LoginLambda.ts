import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (
    event: LoginRequest
): Promise<AuthenticateResponse> => {
    if (event.password == null) {
        throw new Error("[Bad Request] requested password is null");
    }

    if (event.username == null) {
        throw new Error("[Bad Request] requested username is null");
    }

    let response = new AuthenticateResponse(
        true,
        ...(await new UserService().login(event.username, event.password))
    );

    if (response.user == null) {
        throw new Error("[Server Error] could not complete request");
    }

    if (response.token == null) {
        throw new Error("[Server Error] could not complete request");
    }
    return response;
};
