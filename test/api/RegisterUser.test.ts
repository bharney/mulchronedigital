import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import LoginHelpers from "../helpers/LoginHelpers";
import { AESEncryptionResult } from "../../shared/Encryption";
const assert = chai.assert;
chai.use(chaiHttp);

describe("Register User Route Path Tests", () => {
    const host = "http://localhost:8080";
    const path = "/api/userauth/registeruser";

    it("it should say the username is invalid", async () => {
        const username = "thisusernameiswaytolong";
        const email = "basicuser@gmail.com";
        const password = "Password1234!@#$";
        const encryptedRegisterUserObject: AESEncryptionResult = await LoginHelpers.createRegisterUserObject(username, email, password);
        return chai.request(host)
            .post(path)
            .set("Content-Type", "application/json")
            .send(encryptedRegisterUserObject)
            .catch(error => {
                assert.equal(error.status, 422);
                const body = JSON.parse(error.response.text);
                assert.equal(body.status, false);
                assert.equal(body.message, "You must enter a username between 4 and 12 characters long");
            });
    });

    it("it should say the email is invalid", async () => {
        const username = "thisisok";
        const email = "basicuser@gmail.";
        const password = "Password1234!@#$";
        const encryptedRegisterUserObject: AESEncryptionResult = await LoginHelpers.createRegisterUserObject(username, email, password);
        return chai.request(host)
            .post(path)
            .set("Content-Type", "application/json")
            .send(encryptedRegisterUserObject)
            .catch(error => {
                assert.equal(error.status, 422);
                const body = JSON.parse(error.response.text);
                assert.equal(body.status, false);
                assert.equal(body.message, "You must enter a valid email address");
            });
    });
});