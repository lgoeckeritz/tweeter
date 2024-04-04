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
const Service_1 = require("./Service");
class UserService extends Service_1.Service {
    constructor(daoFactory) {
        super(daoFactory);
    }
    getUser(authToken, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            this.verfiyRequestData([authToken, alias]);
            this.authenticate(authToken.token);
            const userEntity = yield this.usersDAO.getUser(alias);
            this.verifyReturn(userEntity);
            return new tweeter_shared_1.User(userEntity.firstName, userEntity.lastName, userEntity.alias, userEntity.imageUrl);
        });
    }
    login(alias, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.verfiyRequestData([alias, password]);
            const userEntity = yield this.usersDAO.loginUser(alias, password);
            if (userEntity !== undefined) {
                return yield this.returnUserToken(userEntity, alias);
            }
            else {
                throw new Error("[Forbidden Error] Invalid alias or password");
            }
        });
    }
    register(firstName, lastName, alias, password, imageStringBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            this.verfiyRequestData([
                firstName,
                lastName,
                alias,
                password,
                imageStringBase64,
            ]);
            //converting image string to image url
            const imageUrl = yield this.imageDAO.putImage(alias, imageStringBase64);
            const userEntity = yield this.usersDAO.registerUser(firstName, lastName, alias, password, imageUrl);
            if (userEntity !== undefined) {
                return yield this.returnUserToken(userEntity, alias);
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
    returnUserToken(userEntity, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            //generate and store authToken
            const authToken = tweeter_shared_1.AuthToken.Generate();
            yield this.authTokenDAO.recordAuthToken(new AuthTokenEntity_1.AuthTokenEntity(authToken.token, authToken.timestamp, alias));
            //generating user from userEntity
            const user = new tweeter_shared_1.User(userEntity.firstName, userEntity.lastName, userEntity.alias, userEntity.imageUrl);
            return [user, authToken];
        });
    }
}
exports.UserService = UserService;
