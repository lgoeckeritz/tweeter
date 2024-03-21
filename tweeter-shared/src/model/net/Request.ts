import { AuthToken } from "../domain/AuthToken";

export class TweeterRequest {}

export class GetUserRequest extends TweeterRequest {
    authToken: AuthToken;
    alias: string;

    constructor(authToken: AuthToken, alias: string) {
        super();
        this.authToken = authToken;
        this.alias = alias;
    }
}

export class LoginRequest extends TweeterRequest {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }
}

export class RegisterRequest extends TweeterRequest {
    firstName: string;
    lastName: string;
    alias: string;
    password: string;
    imageStringBase64: string;

    constructor(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageStringBase64: string
    ) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.alias = alias;
        this.password = password;
        this.imageStringBase64 = imageStringBase64;
    }
}

export class LogoutRequest extends TweeterRequest {
    token: AuthToken;

    constructor(token: AuthToken) {
        super();
        this.token = token;
    }
}
