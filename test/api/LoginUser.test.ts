import * as mocha from "mocha";
import * as chai from "chai";
import { JsonWebTokenWorkers } from "../../server/security/JsonWebTokenWorkers";
import chaiHttp = require("chai-http");
import { UserAuthenicationDataAccess } from "../../server/data-access/UserAuthenicationDataAccess";
import { User } from "../../server/models/User";
import LoginHelpers from "../helpers/LoginHelpers";
const assert = chai.assert;
chai.use(chaiHttp);

describe("Login User Route Test", () => {
    const host = "http://localhost:8080";
    const path = "/api/userauth/loginuser";

    it("it should return a valid Admin JSON Web Token in the response body", async () => {
        const userPassword = "Password1234!@#$";
        const userEmail = "admin@gmail.com";
        const encryptedLoginInfo = await LoginHelpers.createLoginUserObject(userPassword, userEmail);
        return chai.request(host)
            .post(path)
            .set("Content-Type", "application/json")
            .send(encryptedLoginInfo)
            .then(async response => {
                const responseBody = response.body;
                assert.equal(responseBody.status, true);
                assert.equal(typeof responseBody.token, typeof "");
                const decodedToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(responseBody.token);
                const databaseUsers: User[] = await UserAuthenicationDataAccess.getJSONWebTokenInfoOfActiveUserByUserId(decodedToken.id);
                assert.equal(await JsonWebTokenWorkers.verifiyJsonWebToken(responseBody.token, databaseUsers[0].jsonWebTokenPublicKey), true);
                assert.equal(decodedToken.isAdmin, true);
            });
    });

    it("it should return a valid user token JSON Web Token in the response header", async () => {
        const userPassword = "Password1234!@#$";
        const userEmail = "basicuser@gmail.com";
        const encryptedLoginInfo = await LoginHelpers.createLoginUserObject(userPassword, userEmail);
        return chai.request(host)
            .post(path)
            .set("Content-Type", "application/json")
            .send(encryptedLoginInfo)
            .then(async response => {
                const body = response.body;
                assert.equal(body.status, true);
                assert.equal(typeof body.token, typeof "");
                const decodedToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(body.token);
                const databaseUsers: User[] = await UserAuthenicationDataAccess.getJSONWebTokenInfoOfActiveUserByUserId(decodedToken.id);
                assert.equal(await JsonWebTokenWorkers.verifiyJsonWebToken(body.token, databaseUsers[0].jsonWebTokenPublicKey), true);
                assert.equal(decodedToken.isAdmin, false);
            });
    });

    it("it should return a response message of invalid email", async () => {
        const userPassword = "Password1234!@#$";
        const userEmail = "basicuser";
        const encryptedLoginInfo = await LoginHelpers.createLoginUserObject(userPassword, userEmail);
        return chai.request(host)
            .post(path)
            .set("Content-Type", "application/json")
            .send(encryptedLoginInfo)
            .then(response => {
                // nothing here this is suppose to return and HTTP error status code.
            })
            .catch(error => {
                assert.equal(error.status, 401);
                const body = JSON.parse(error.response.text);
                assert.equal(body.status, false);
                assert.equal(body.message, "You must enter a valid email address");
            });
    });

    it("it should return a response of invalid password", async () => {
        const userPassword = "Pass$";
        const userEmail = "basicuser@gmail.com";
        const encryptedLoginInfo = await LoginHelpers.createLoginUserObject(userPassword, userEmail);
        return chai.request(host)
            .post(path)
            .set("Content-Type", "application/json")
            .send(encryptedLoginInfo)
            .then(response => {
                // nothing here this is suppose to return and HTTP error status code.
            })
            .catch(error => {
                assert.equal(error.status, 401);
                const body = JSON.parse(error.response.text);
                assert.equal(body.status, false);
                assert.equal(body.message, "Your password must be atleast 8 characters with one upper case letter, one lower case letter, one number, and one special character");
            });
    });

    it("it should return a response of user is not active", async () => {
        const userPassword = "Password1234!@#$";
        const userEmail = "basicinactiveuser@gmail.com";
        const encryptedLoginInfo = await LoginHelpers.createLoginUserObject(userPassword, userEmail);
        return chai.request(host)
            .post(path)
            .set("Content-Type", "application/json")
            .send(encryptedLoginInfo)
            .then(response => {
                // nothing here this is suppose to return and HTTP error status code.
            })
            .catch(error => {
                assert.equal(error.status, 401);
                const body = JSON.parse(error.response.text);
                assert.equal(body.status, false);
                assert.equal(body.message.includes("currently isn't active."), true);
            });
    });

    it("it should return a response of password do not match", async () => {
        const userPassword = "Password1234!@#$@!";
        const userEmail = "basicuser@gmail.com";
        const encryptedLoginInfo = await LoginHelpers.createLoginUserObject(userPassword, userEmail);
        return chai.request(host)
            .post(path)
            .set("Content-Type", "application/json")
            .send(encryptedLoginInfo)
            .then(response => {
                // nothing here this is suppose to return and HTTP error status code.
            })
            .catch(error => {
                assert.equal(error.status, 401);
                const body = JSON.parse(error.response.text);
                assert.equal(body.status, false);
                assert.equal(body.message, "Sorry the password you entered does not match the one stored.");
            });
    });
});
