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
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../model/service/UserService");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.password == null) {
        throw new Error("[Bad Request] requested password is null");
    }
    if (event.username == null) {
        throw new Error("[Bad Request] requested username is null");
    }
    let response = new tweeter_shared_1.AuthenticateResponse(true, ...(yield new UserService_1.UserService().login(event.username, event.password)));
    if (response.user == null) {
        throw new Error("[Server Error] could not complete request");
    }
    if (response.token == null) {
        throw new Error("[Server Error] could not complete request");
    }
    return response;
});
exports.handler = handler;
