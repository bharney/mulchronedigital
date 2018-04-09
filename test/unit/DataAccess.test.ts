import * as mocha from "mocha";
import * as chai from "chai";
import bcrypt = require("bcryptjs");
import { DnsHelpers } from "../../server/globals/DnsHelpers";
import { DataAccess } from "../../server/data-access/classes/DataAccess";
import { DatabaseHelpers } from "../helpers/DatabaseHelpers";
import { User } from "../../server/models/User";
const assert = chai.assert;

describe("DataAccess Base Class Test", () => {
    it("it should have a method of findIfUserExistsByUsername(userName: string)", () => {
        assert.equal(DataAccess.hasOwnProperty("findIfUserExistsByUsername"), true);
    });

    it("it should have a method of updateUserPassword(userId: string, user: User)", () => {
        assert.equal(DataAccess.hasOwnProperty("updateUserPassword"), true);
    });

    it("it should update the admin users password successfully", async () => {
        const username = "admin";
        const userId = await DatabaseHelpers.getUsersDatabaseIdByUsername(username);
        const user: User = new User("admin", null, "Password1234!@#$");
        const updateResult = await DataAccess.updateUserPassword(userId, user);
        assert.equal(updateResult.result.n, 1);
        assert.equal(updateResult.result.nModified, 1);
        assert.equal(updateResult.result.ok, 1);
    });

    it("it should return null because of a bad userId value at updateUserPassword(userId: string, user: User)", async () => {
        const user: User = new User("admin");
        const userId = null;
        assert.equal(await DataAccess.updateUserPassword(userId, user), null);
    });

    it("it should return null because of a bad user parameter at  updateUserPassword(userId: string, user: User)", async () => {
        const user = null;
        const userId = "123879Zmnk89";
        assert.equal(await DataAccess.updateUserPassword(userId, user), null);
    });

    it("it should have a method of findUserLoginDetailsByEmail(userEmail: string)", () => {
        assert.equal(DataAccess.hasOwnProperty("findUserLoginDetailsByEmail"), true);
    }); 

    it("it should return an empty array because there is not a user with this email", async () => {
        const badUserEmail = "welcome@gmail.com";
        const databaseUsers: User[] = await DataAccess.findUserLoginDetailsByEmail(badUserEmail);
        assert.equal(typeof(databaseUsers), typeof([]));
        assert.equal(databaseUsers.length, 0);
    });

    it("it should return the login details for the admin user", async () => {
        const email = "admin@gmail.com";
        const databaseUsers: User[] = await DataAccess.findUserLoginDetailsByEmail(email);
        const user = databaseUsers[0];
        assert.equal(user.hasOwnProperty("_id"), true);
        assert.equal(user.hasOwnProperty("password"), true);
        assert.equal(user.hasOwnProperty("username"), true);
        assert.equal(user.hasOwnProperty("isAdmin"), true);
        assert.equal(user.hasOwnProperty("isActive"), true);
        assert.equal(user.hasOwnProperty("publicKeyPairOne"), true);
        assert.equal(user.hasOwnProperty("privateKeyPairTwo"), true);
    });

    it("it should return any empty array because an invalid parameter was passed to findUserLoginDetailsByEmail(userEmail: string)", async () => {
        const email = null;
        const result = await DataAccess.findUserLoginDetailsByEmail(email);
        assert.equal(result.length, 0);
        assert.equal(typeof(result), typeof([]));
    });

    it("it should have a method of getUserPassword(userId: string)", () => {
        assert.equal(DataAccess.hasOwnProperty("getUserPassword"), true);
    });

    it("it should return the password for the admin user", async () => {
        const username = "admin";
        const adminDatabaseId = await DatabaseHelpers.getUsersDatabaseIdByUsername(username);
        const userPassword: User[] = await DataAccess.getUserPassword(adminDatabaseId);
        assert.equal(typeof(userPassword[0].password), typeof (""));
        const passwordToComapre = "Password1234!@#$";
        bcrypt.compare(passwordToComapre, userPassword[0].password)
        .then(result => {
            assert.equal(result, true);
        });
    });

    it("it should return any empty array because an invalid parameter was passed to getUserPassword(userId: string)", async () => {
        const badUserId = null;
        const userName = await DataAccess.getUserPassword(badUserId);
        assert.equal(typeof(userName), typeof([]));
        assert.equal(userName.length, 0);
    }); 
});
