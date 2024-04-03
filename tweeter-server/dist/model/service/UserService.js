"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const AuthTokenEntity_1 = require("../entity/AuthTokenEntity");
class UserService {
    constructor(daoFactory) {
        this.authTokenDAO = daoFactory.getAuthTokensDAO();
        this.usersDAO = daoFactory.getUsersDAO();
        this.imageDAO = daoFactory.getImageDAO();
    }
    getUser(authToken, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            //checking to make sure request is good
            if (authToken === null || alias === null) {
                throw new Error("[Bad Request] part or all of the request is null");
            }
            const authenticated = yield this.authTokenDAO.authenticate(authToken.token);
            if (authenticated) {
                const userEntity = yield this.usersDAO.getUser(alias);
                if (userEntity !== undefined) {
                    return new tweeter_shared_1.User(userEntity.firstName, userEntity.lastName, userEntity.alias, userEntity.imageUrl);
                }
                else {
                    return null;
                }
            }
            else {
                throw new Error("[Forbidden Error] authtoken either doesn't exist or is timed out");
            }
        });
    }
    login(alias, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //checking to make sure request is good
            if (password === null || alias === null) {
                throw new Error("[Bad Request] part or all of the request is null");
            }
            const userEntity = yield this.usersDAO.loginUser(alias, password);
            if (userEntity !== undefined) {
                //generate and store authToken
                const authToken = tweeter_shared_1.AuthToken.Generate();
                yield this.authTokenDAO.recordAuthToken(new AuthTokenEntity_1.AuthTokenEntity(authToken.token, authToken.timestamp, alias));
                //generating user from userEntity
                const user = new tweeter_shared_1.User(userEntity.firstName, userEntity.lastName, userEntity.alias, userEntity.imageUrl);
                return [user, authToken];
            }
            else {
                throw new Error("[Forbidden Error] Invalid alias or password");
            }
        });
    }
    register(firstName, lastName, alias, password, imageStringBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            //checking to make sure request is good
            if (firstName === null ||
                lastName === null ||
                alias === null ||
                password === null ||
                imageStringBase64 === null) {
                throw new Error("[Bad Request] part or all of the request is null");
            }
            //converting image string to image url
            const imageUrl = yield this.imageDAO.putImage(alias, imageStringBase64);
            const userEntity = yield this.usersDAO.registerUser(firstName, lastName, alias, password, imageUrl);
            if (userEntity !== undefined) {
                //generate and store authToken
                const authToken = tweeter_shared_1.AuthToken.Generate();
                yield this.authTokenDAO.recordAuthToken(new AuthTokenEntity_1.AuthTokenEntity(authToken.token, authToken.timestamp, alias));
                //generating user from userEntity
                const user = new tweeter_shared_1.User(userEntity.firstName, userEntity.lastName, userEntity.alias, userEntity.imageUrl);
                return [user, authToken];
            }
            else {
                throw new Error("[Forbidden Error] Invalid registration");
            }
        });
    }
    logout(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authTokenDAO.deleteAuthToken(authToken.token);
        });
    }
}
exports.UserService = UserService;
