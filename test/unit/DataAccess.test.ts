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

    it("it should have a method of findUserLoginDetailsByEmail(userEmail: string)", () => {
        assert.equal(DataAccess.hasOwnProperty("findUserLoginDetailsByEmail"), true);
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

    it("it should return any empty array because an invalid parameter was passed", async () => {
        const badUserId = null;
        const userName = await DataAccess.getUserPassword(badUserId);
        assert.equal(typeof(userName), typeof([]));
        assert.equal(userName.length, 0);
    }); 
});
