import {
    AuthenticateResponse,
    LoginRequest,
    RegisterRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import {
    FollowInfoRequest,
    GetIsFollowerStatusRequest,
    GetUserRequest,
    LoadMoreStatusItemsRequest,
    LoadMoreUserItemsRequest,
    LogoutRequest,
    PostStatusRequest,
} from "tweeter-shared/dist/model/net/Request";
import {
    GetFollowCountResponse,
    GetIsFollowerStatusResponse,
    GetUserResponse,
    LoadMoreStatusItemsResponse,
    LoadMoreUserItemsResponse,
    TweeterResponse,
} from "tweeter-shared/dist/model/net/Response";

export class ServerFacade {
    private SERVER_URL =
        "https://gh82nug6qk.execute-api.us-east-1.amazonaws.com/dev";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    async getUser(request: GetUserRequest): Promise<GetUserResponse> {
        const endpoint = "/service/getUser";
        const response: JSON =
            await this.clientCommunicator.doPost<GetUserRequest>(
                request,
                endpoint
            );

        return GetUserResponse.fromJson(response);
    }

    async login(request: LoginRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/login";
        const response: JSON =
            await this.clientCommunicator.doPost<LoginRequest>(
                request,
                endpoint
            );

        return AuthenticateResponse.fromJson(response);
    }

    async register(request: RegisterRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/register";
        const response: JSON =
            await this.clientCommunicator.doPost<RegisterRequest>(
                request,
                endpoint
            );
        return AuthenticateResponse.fromJson(response);
    }

    async logout(request: LogoutRequest): Promise<TweeterResponse> {
        const endpoint = "/service/logout";
        const response: JSON =
            await this.clientCommunicator.doPost<LogoutRequest>(
                request,
                endpoint
            );
        return TweeterResponse.fromJson(response);
    }

    /**
     * StatusService Server Calls
     */

    async loadMoreFeedItems(
        request: LoadMoreStatusItemsRequest
    ): Promise<LoadMoreStatusItemsResponse> {
        const endpoint = "/service/loadMoreFeedItems";
        const response: JSON =
            await this.clientCommunicator.doPost<LoadMoreStatusItemsRequest>(
                request,
                endpoint
            );
        return LoadMoreStatusItemsResponse.fromJson(response);
    }

    async loadMoreStoryItems(
        request: LoadMoreStatusItemsRequest
    ): Promise<LoadMoreStatusItemsResponse> {
        const endpoint = "/service/loadMoreStoryItems";
        const response: JSON =
            await this.clientCommunicator.doPost<LoadMoreStatusItemsRequest>(
                request,
                endpoint
            );
        return LoadMoreStatusItemsResponse.fromJson(response);
    }

    async postStatus(request: PostStatusRequest): Promise<TweeterResponse> {
        const endpoint = "/service/postStatus";
        const response: JSON =
            await this.clientCommunicator.doPost<PostStatusRequest>(
                request,
                endpoint
            );
        return TweeterResponse.fromJson(response);
    }

    /**
     * FollowService Server Calls
     */

    async loadMoreFollowers(
        request: LoadMoreUserItemsRequest
    ): Promise<LoadMoreUserItemsResponse> {
        const endpoint = "/service/loadMoreFollowers";
        const response: JSON =
            await this.clientCommunicator.doPost<LoadMoreUserItemsRequest>(
                request,
                endpoint
            );
        return LoadMoreUserItemsResponse.fromJson(response);
    }

    async loadMoreFollowees(
        request: LoadMoreUserItemsRequest
    ): Promise<LoadMoreUserItemsResponse> {
        const endpoint = "/service/loadMoreFollowees";
        const response: JSON =
            await this.clientCommunicator.doPost<LoadMoreUserItemsRequest>(
                request,
                endpoint
            );
        return LoadMoreUserItemsResponse.fromJson(response);
    }

    async getIsFollowerStatus(
        request: GetIsFollowerStatusRequest
    ): Promise<GetIsFollowerStatusResponse> {
        const endpoint = "/service/getIsFollowerStatus";
        const response: JSON =
            await this.clientCommunicator.doPost<GetIsFollowerStatusRequest>(
                request,
                endpoint
            );
        return GetIsFollowerStatusResponse.fromJson(response);
    }

    async getFolloweesCount(
        request: FollowInfoRequest
    ): Promise<GetFollowCountResponse> {
        const endpoint = "/service/getFolloweesCount";
        const response: JSON =
            await this.clientCommunicator.doPost<FollowInfoRequest>(
                request,
                endpoint
            );
        return GetFollowCountResponse.fromJson(response);
    }

    async getFollowersCount(
        request: FollowInfoRequest
    ): Promise<GetFollowCountResponse> {
        const endpoint = "/service/getFollowersCount";
        const response: JSON =
            await this.clientCommunicator.doPost<FollowInfoRequest>(
                request,
                endpoint
            );
        return GetFollowCountResponse.fromJson(response);
    }

    async follow(request: FollowInfoRequest): Promise<TweeterResponse> {
        const endpoint = "/service/follow";
        const response: JSON =
            await this.clientCommunicator.doPost<FollowInfoRequest>(
                request,
                endpoint
            );
        return TweeterResponse.fromJson(response);
    }

    async unfollow(request: FollowInfoRequest): Promise<TweeterResponse> {
        const endpoint = "/service/unfollow";
        const response: JSON =
            await this.clientCommunicator.doPost<FollowInfoRequest>(
                request,
                endpoint
            );
        return TweeterResponse.fromJson(response);
    }
}
