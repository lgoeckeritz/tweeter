import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (
    event: GetUserRequest
): Promise<GetUserResponse> => {
    let response = new GetUserResponse(
        true,
        await new UserService().getUser(event.authToken, event.alias)
    );
    return response;
};
