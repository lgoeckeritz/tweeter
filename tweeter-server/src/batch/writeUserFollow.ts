import { FollowDaoFillTable } from "./FollowDaoFillTable";
import { UserDaoFillTable } from "./UserDaoFillTable";
import { UserEntity } from "../model/entity/UserEntity";

// Make sure to increase the write capacities for the follow table, follow index, and user table.

let mainUsername = "@cat";
let followername = "@serpent";
let password = "password";
let imageUrl = "https://cs-340-2024.s3.us-east-1.amazonaws.com/image/@serpent";
let firstName = "first";
let lastName = "last";

let numUsers = 10000;
let batchSize = 25;
let aliasList: string[] = Array.from(
    { length: numUsers },
    (_, i) => followername + (i + 1)
);
let followDaoFillTable = new FollowDaoFillTable();
let userDaoFillTable = new UserDaoFillTable();

//console.log("setting followers");
//setFollowers(0);
//console.log("setting users");
//setUsers(0);
//userDaoFillTable.increaseFollowersCount(mainUsername, numUsers);

function setFollowers(i: number) {
    if (i >= numUsers) return;
    else if (i % 1000 == 0) {
        console.log(i + " followers");
    }
    let followList = aliasList.slice(i, i + batchSize);
    followDaoFillTable
        .createFollows(mainUsername, followList)
        .then(() => setFollowers(i + batchSize))
        .catch((err: Error) =>
            console.log("error while setting followers: " + err)
        );
}
function setUsers(i: number) {
    if (i >= numUsers) return;
    else if (i % 1000 == 0) {
        console.log(i + " users");
    }
    let userList = createUserList(i);
    userDaoFillTable
        .createUsers(userList, password)
        .then(() => setUsers(i + batchSize))
        .catch((err: Error) =>
            console.log("error while setting users: " + err)
        );
}

function createUserList(i: number) {
    let users: UserEntity[] = [];
    // Ensure that we start at alias1 rather than aliaszero.
    let start = i + 1;
    let limit = start + batchSize;
    for (let j = start; j < limit; ++j) {
        let user = new UserEntity(
            firstName + j,
            lastName + j,
            followername + j,
            imageUrl,
            password,
            0,
            0
        );
        users.push(user);
    }
    return users;
}
