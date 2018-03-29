import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");
const assert = chai.assert;
chai.use(chaiHttp);
import { createLoginUserObject } from "../helpers/LoginHelpers";

const host = "http://localhost:8080";
const loginUserPath = "/api/userauth/loginuser";

const getRegularUserToken = () => {
    return new Promise(async (resolve, reject) => {
        const host = "http://localhost:8080";
        const loginUserPath = "/api/userauth/loginuser";
        const userPassword = "Password1234!@#$";
        const userEmail = "basicuser@gmail.com";
        const encryptedLoginInfo = await createLoginUserObject(userPassword, userEmail);
        chai.request(host)
            .post(loginUserPath)
            .set("Content-Type", "application/json")
            .send(encryptedLoginInfo)
            .then(response => {
                resolve(response.body.token);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const getAdminUserToken = () => {
    return new Promise(async (resolve, reject) => {
        const userPassword = "Password1234!@#$";
        const userEmail = "admin@gmail.com";
        const encryptedLoginInfo = await createLoginUserObject(userPassword, userEmail);
        chai.request(host)
            .post(loginUserPath)
            .set("Content-Type", "application/json")
            .send(encryptedLoginInfo)
            .then(response => {
                resolve(response.body.token);
            })
            .catch(error => {
                reject(error);
            });
    });
};

describe("BaseRouter Tests", () => {
    // I suppose it really doesnt matter the exact route we test, I'm just testing the methods the other routers in inherit from the abstract class BaseRouter.
    const path = "/api/admindashboard/getusers";
    let regularUserToken;
    let adminUserToken;
    before(async () => {
        regularUserToken = await getRegularUserToken();
        adminUserToken = await getAdminUserToken();
    });

    it("it should say no token in header", async () => {
        return chai.request(host)
            .get(path)
            .catch(async error => {
                assert.equal(error.status, 401);
                const body = JSON.parse(error.response.text);
                assert.equal(body.status, false);
                assert.equal(body.relogin, true);
                assert.equal(body.message, "No token in header");
            });
    });

    it("it should say the user account is not an admin", async () => {
        return chai.request(host)
            .get(path)
            .set("mulchronedigital-token", regularUserToken)
            .catch(error => {
                assert.equal(error.status, 503);
                const body = JSON.parse(error.response.text);
                assert.equal(body.status, false);
                assert.equal(body.relogin, true);
                const messageToTest = "The user account is not an admin, if you previously had admin access your access maybe have been revoked";
                assert.equal(body.message, messageToTest);
            });
    });

    it("it should return a response body of true and some users in an array", async () => {
        return chai.request(host)
        .get(path)
        .set("mulchronedigital-token", regularUserToken)
        .then(response => {
            assert.equal(response.status, 200);
            const body = JSON.parse(response.body.text);
            assert.equal(body.status, true);
            assert.isArray(body.users);
            const lengthOfUsers = body.users.length;
            assert.equal((lengthOfUsers > 0), true);
        })
        .catch(error => {

        });
    });
});
