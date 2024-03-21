import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";
import { AuthTokenDto } from "../dto/AuthTokenDto";
import { UserDto } from "../dto/UserDto";

//consider changing this to an interface like this: (check the slides for what it should actually look like)
// export interface TweeterResponse {
//     readonly success: boolean;
//     readonly message: string | null;
// }
export class TweeterResponse {
    private _success: boolean;
    private _message: string | null;

    constructor(success: boolean, message: string | null = null) {
        this._success = success;
        this._message = message;
    }

    get success() {
        return this._success;
    }

    get message() {
        return this._message;
    }

    static fromJson(json: JSON): TweeterResponse {
        const jsonObject: ResponseJson = json as unknown as ResponseJson;

        return new TweeterResponse(jsonObject._success, jsonObject._message);
    }
}

interface ResponseJson {
    _success: boolean;
    _message: string;
}

export class GetUserResponse extends TweeterResponse {
    private _user: UserDto | null;

    constructor(
        success: boolean,
        user: UserDto | null,
        message: string | null = null
    ) {
        super(success, message);

        this._user = user;
    }

    get user() {
        return this._user;
    }

    static fromJson(json: JSON): GetUserResponse {
        interface GetUserResponseJson extends ResponseJson {
            _user: JSON;
        }

        const jsonObject: GetUserResponseJson =
            json as unknown as GetUserResponseJson;

        const deserializedUser = User.fromJson(
            JSON.stringify(jsonObject._user)
        );

        if (deserializedUser === null) {
            throw new Error(
                "GetUserResponse, could not deserialize user with json:\n" +
                    JSON.stringify(jsonObject._user)
            );
        }

        return new GetUserResponse(
            jsonObject._success,
            deserializedUser,
            jsonObject._message
        );
    }
}

export class AuthenticateResponse extends TweeterResponse {
    private _user: UserDto;
    private _token: AuthTokenDto;

    constructor(
        success: boolean,
        user: UserDto,
        token: AuthTokenDto,
        message: string | null = null
    ) {
        super(success, message);
        this._user = user;
        this._token = token;
    }

    get user() {
        return this._user;
    }

    get token() {
        return this._token;
    }

    static fromJson(json: JSON): AuthenticateResponse {
        interface AuthenticateResponseJson extends ResponseJson {
            _user: JSON;
            _token: JSON;
        }

        const jsonObject: AuthenticateResponseJson =
            json as unknown as AuthenticateResponseJson;

        const deserializedUser = User.fromJson(
            JSON.stringify(jsonObject._user)
        );

        if (deserializedUser === null) {
            throw new Error(
                "AuthenticateResponse, could not deserialize user with json:\n" +
                    JSON.stringify(jsonObject._user)
            );
        }

        const deserializedToken = AuthToken.fromJson(
            JSON.stringify(jsonObject._token)
        );

        if (deserializedToken === null) {
            throw new Error(
                "AuthenticateResponse, could not deserialize token with json:\n" +
                    JSON.stringify(jsonObject._token)
            );
        }

        return new AuthenticateResponse(
            jsonObject._success,
            deserializedUser,
            deserializedToken,
            jsonObject._message
        );
    }
}

/**
 * StatusService Responses
 */

export class LoadMoreStatusItemsResponse extends TweeterResponse {
    private _pageOfStatuses: Status[];
    private _hasMoreItems: boolean;

    constructor(
        success: boolean,
        pageOfStatuses: Status[],
        hasMoreItems: boolean,
        message: string | null = null
    ) {
        super(success, message);
        this._pageOfStatuses = pageOfStatuses;
        this._hasMoreItems = hasMoreItems;
    }

    get pageOfStatuses(): Status[] {
        return this._pageOfStatuses;
    }

    get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }

    static fromJson(json: JSON): LoadMoreStatusItemsResponse {
        interface LoadMoreStatusItemsResponseJson extends ResponseJson {
            _pageOfStatuses: JSON;
            _hasMoreItems: JSON;
        }

        const jsonObject: LoadMoreStatusItemsResponseJson =
            json as unknown as LoadMoreStatusItemsResponseJson;

        const deserializedPageOfStatuses: Status[] | null = JSON.parse(
            JSON.stringify(jsonObject._pageOfStatuses)
        );

        if (deserializedPageOfStatuses === null) {
            throw new Error(
                "LoadMoreFeedItemsResponse, could not deserialize user with json:\n" +
                    JSON.stringify(jsonObject._pageOfStatuses)
            );
        }

        const deserializedHadMoreItems: boolean | null = JSON.parse(
            JSON.stringify(jsonObject._hasMoreItems)
        );

        if (deserializedHadMoreItems === null) {
            throw new Error(
                "LoadMoreFeedItemsResponse, could not deserialize user with json:\n" +
                    JSON.stringify(jsonObject._hasMoreItems)
            );
        }

        return new LoadMoreStatusItemsResponse(
            jsonObject._success,
            deserializedPageOfStatuses,
            deserializedHadMoreItems,
            jsonObject._message
        );
    }
}
