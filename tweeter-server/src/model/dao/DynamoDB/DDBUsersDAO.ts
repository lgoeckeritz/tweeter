import { GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { UserEntity } from "../../entity/UserEntity";
import { UsersDAO } from "../interface/UsersDAO";
import { DDBDAO } from "./DDBDAO";
import bcrypt from "bcrypt";

export class DDBUsersDAO extends DDBDAO<UserEntity> implements UsersDAO {
    readonly first_name = "first_name";
    readonly last_name = "last_name";
    readonly handle = "handle";
    readonly image_url = "image_url";
    readonly password = "password";
    readonly num_followers = "num_followers";
    readonly num_followees = "num_followees";

    private saltRounds = 8;

    constructor() {
        super("users");
    }

    newEntity(output: GetCommandOutput): UserEntity {
        return new UserEntity(
            output.Item![this.first_name],
            output.Item![this.last_name],
            output.Item![this.handle],
            output.Item![this.image_url],
            output.Item![this.password],
            output.Item![this.num_followers],
            output.Item![this.num_followees]
        );
    }

    generateGetItem(entity: UserEntity) {
        return {
            [this.handle]: entity.alias,
        };
    }

    generatePutItem(entity: UserEntity) {
        return {
            [this.handle]: entity.alias,
            [this.first_name]: entity.firstName,
            [this.last_name]: entity.lastName,
            [this.image_url]: entity.imageUrl,
            [this.password]: entity.password,
            [this.num_followers]: entity.numFollowers,
            [this.num_followees]: entity.numFollowees,
        };
    }

    getUpdateExpression(): string {
        return "set num_followers = :value1, num_followees = :value2";
    }

    getUpdateExpressionAttributeValues(entity: UserEntity) {
        throw {
            ":value1": entity.numFollowers,
            ":value2": entity.numFollowees,
        };
    }

    //TODO: figure out if the comparing of hashes should be in here or not
    async loginUser(
        alias: string,
        password: string
    ): Promise<UserEntity | undefined> {
        //getting user associated with the alias
        const userEntity = await this.getUser(alias);
        if (userEntity === undefined) {
            return undefined;
        }
        //comparing the passwords to make sure they match
        const matches: boolean = await bcrypt.compare(
            password,
            userEntity.password
        );
        if (matches) {
            return userEntity;
        } else {
            return undefined;
        }
    }

    async registerUser(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageUrl: string
    ): Promise<UserEntity | undefined> {
        //hashing the password
        let hashPassword = "";
        bcrypt.hash(
            password,
            this.saltRounds,
            (error: Error | undefined, hash: string) => {
                if (error) {
                    return undefined;
                } else {
                    hashPassword = hash;
                }
            }
        );
        const newUserEntity = new UserEntity(
            firstName,
            lastName,
            alias,
            imageUrl,
            hashPassword,
            0,
            0
        );
        //putting new user into the table
        await this.putItem(newUserEntity);
        return newUserEntity;
    }

    async getUser(userHandle: string): Promise<UserEntity | undefined> {
        return this.getItem(new UserEntity("", "", userHandle, "", "", 0, 0));
    }
}
