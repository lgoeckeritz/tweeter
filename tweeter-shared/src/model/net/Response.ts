import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

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
    private _user: User | null;

    constructor(
        success: boolean,
        user: User | null,
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
    private _user: User;
    private _token: AuthToken;

    constructor(
        success: boolean,
        user: User,
        token: AuthToken,
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
    private _pageOfStatuses: (Status | null)[];
    private _hasMoreItems: boolean;

    constructor(
        success: boolean,
        pageOfStatuses: (Status | null)[],
        hasMoreItems: boolean,
        message: string | null = null
    ) {
        super(success, message);
        this._pageOfStatuses = pageOfStatuses;
        this._hasMoreItems = hasMoreItems;
    }

    get pageOfStatuses(): (Status | null)[] {
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

        const jsonArray: (Status | null)[] =
            jsonObject._pageOfStatuses as unknown as Status[];

        const deserializedPageOfStatuses = jsonArray.map((user) =>
            Status.fromJson(JSON.stringify(user))
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

/**
 * FollowService Responses
 */

export class LoadMoreUserItemsResponse extends TweeterResponse {
    private _pageOfUsers: (User | null)[];
    private _hasMoreItems: boolean;

    constructor(
        success: boolean,
        pageOfUsers: (User | null)[],
        hasMoreItems: boolean,
        message: string | null = null
    ) {
        super(success, message);
        this._pageOfUsers = pageOfUsers;
        this._hasMoreItems = hasMoreItems;
    }

    get pageOfUsers(): (User | null)[] {
        return this._pageOfUsers;
    }

    get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }

    static fromJson(json: JSON): LoadMoreUserItemsResponse {
        interface LoadMoreUserItemsResponseJson extends ResponseJson {
            _pageOfUsers: JSON;
            _hasMoreItems: JSON;
        }

        const jsonObject: LoadMoreUserItemsResponseJson =
            json as unknown as LoadMoreUserItemsResponseJson;

        const jsonArray: (User | null)[] =
            jsonObject._pageOfUsers as unknown as User[];

        const deserializedPageOfUsers = jsonArray.map((user) =>
            User.fromJson(JSON.stringify(user))
        );

        if (deserializedPageOfUsers === null) {
            throw new Error(
                "LoadMoreUserItemsResponse, could not deserialize user with json:\n" +
                    JSON.stringify(jsonObject._pageOfUsers)
            );
        }

        const deserializedHadMoreItems: boolean | null = JSON.parse(
            JSON.stringify(jsonObject._hasMoreItems)
        );

        if (deserializedHadMoreItems === null) {
            throw new Error(
                "LoadMoreUserItemsResponse, could not deserialize user with json:\n" +
                    JSON.stringify(jsonObject._hasMoreItems)
            );
        }

        return new LoadMoreUserItemsResponse(
            jsonObject._success,
            deserializedPageOfUsers,
            deserializedHadMoreItems,
            jsonObject._message
        );
    }
}

export class GetIsFollowerStatusResponse extends TweeterResponse {
    private _isFollower: boolean;

    constructor(
        success: boolean,
        isFollower: boolean,
        message: string | null = null
    ) {
        super(success, message);
        this._isFollower = isFollower;
    }

    get isFollower(): boolean {
        return this._isFollower;
    }

    static fromJson(json: JSON): GetIsFollowerStatusResponse {
        interface GetIsFollowerStatusResponseJson extends ResponseJson {
            _isFollower: JSON;
        }

        const jsonObject: GetIsFollowerStatusResponseJson =
            json as unknown as GetIsFollowerStatusResponseJson;

        const deserializedIsFollower: boolean | null = JSON.parse(
            JSON.stringify(jsonObject._isFollower)
        );

        if (deserializedIsFollower === null) {
            throw new Error(
                "GetIsFollowerStatusResponse, could not deserialize user with json:\n" +
                    JSON.stringify(jsonObject._isFollower)
            );
        }

        return new GetIsFollowerStatusResponse(
            jsonObject._success,
            deserializedIsFollower,
            jsonObject._message
        );
    }
}

export class GetFollowCountResponse extends TweeterResponse {
    private _count: number;

    constructor(
        success: boolean,
        count: number,
        message: string | null = null
    ) {
        super(success, message);
        this._count = count;
    }

    get count(): number {
        return this._count;
    }

    static fromJson(json: JSON): GetFollowCountResponse {
        interface GetFollowCountResponseJson extends ResponseJson {
            _count: JSON;
        }

        const jsonObject: GetFollowCountResponseJson =
            json as unknown as GetFollowCountResponseJson;

        const deserializedCount: number | null = JSON.parse(
            JSON.stringify(jsonObject._count)
        );

        if (deserializedCount === null) {
            throw new Error(
                "GetFollowCountResponse, could not deserialize user with json:\n" +
                    JSON.stringify(jsonObject._count)
            );
        }

        return new GetFollowCountResponse(
            jsonObject._success,
            deserializedCount,
            jsonObject._message
        );
    }
}
