import { AuthenticateResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (
    event: RegisterRequest
): Promise<AuthenticateResponse> => {
    if (event.alias == null) {
        throw new Error("[Bad Request] requested alias is null");
    }

    if (event.firstName == null) {
        throw new Error("[Bad Request] requested firstName is null");
    }
    if (event.imageStringBase64 == null) {
        throw new Error("[Bad Request] requested imageStringBase64 is null");
    }

    if (event.lastName == null) {
        throw new Error("[Bad Request] requested lastName is null");
    }
    if (event.password == null) {
        throw new Error("[Bad Request] requested password is null");
    }

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

    if (response.token == null) {
        throw new Error("[Server Error] could not complete request");
    }
    if (response.user == null) {
        throw new Error("[Server Error] could not complete request");
    }

    return response;
};
