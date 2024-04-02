import { AuthToken } from "tweeter-shared";

export interface AuthTokenDAO {
    authenticate(authToken: AuthToken): Promise<boolean>;
    recordAuthToken(authToken: AuthToken): Promise<void>;
    deleteAuthToken(authToken: AuthToken): Promise<void>;
}
