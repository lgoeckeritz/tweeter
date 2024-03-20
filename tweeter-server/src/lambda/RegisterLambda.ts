import { AuthenticateResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (
    event: RegisterRequest
): Promise<AuthenticateResponse> => {
    let response = new AuthenticateResponse(
        true,
        ...(await new UserService().register(
            event.firstName,
            event.lastName,
            event.alias,
            event.password,
            event.imageStringBase64
        ))
    );
    return response;
};
