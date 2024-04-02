import { AuthToken } from "tweeter-shared";

//look into storing the user's handle with the authtoken
export interface AuthTokenDAO {
    authenticate(token: string): Promise<boolean>;
    getAuthTokenHandle(token: string): Promise<string>;
    recordAuthToken(authToken: AuthToken, userHandle: string): Promise<void>;
    deleteAuthToken(token: string): Promise<void>;
}
