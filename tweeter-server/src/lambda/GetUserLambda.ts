import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (
    event: GetUserRequest
): Promise<GetUserResponse> => {
    if (event.alias == null) {
        throw new Error("[Bad Request] requested alias is null");
    }

    if (event.authToken == null) {
        throw new Error("[Bad Request] requested authToken is null");
    }

    let response = new GetUserResponse(
        true,
        await new UserService().getUser(event.authToken, event.alias)
    );

    if (response.user == null) {
        throw new Error("[Server Error] could not complete request");
    }

    return response;
};
