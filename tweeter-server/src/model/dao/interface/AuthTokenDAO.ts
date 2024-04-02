import { AuthToken } from "tweeter-shared";

//look into storing the user's handle with the authtoken
export interface AuthTokenDAO {
    authenticate(authToken: AuthToken): Promise<boolean>;
    recordAuthToken(authToken: AuthToken): Promise<void>;
    deleteAuthToken(authToken: AuthToken): Promise<void>;
}
