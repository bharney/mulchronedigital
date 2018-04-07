import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import LoginHelpers from "../helpers/LoginHelpers";
import { AESEncryptionResult } from "../../shared/Encryption";
import { DatabaseHelpers } from "../helpers/DatabaseHelpers";
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

    it("it should say the password is invalid", async () => {
        const username = "testuser";
        const email = "testuser@gmail.com";
        const password = "Password1234";
        const encryptedRegisterUserObject: AESEncryptionResult = await LoginHelpers.createRegisterUserObject(username, email, password);
        return chai.request(host)
            .post(path)
            .set("Content-Type", "application/json")
            .send(encryptedRegisterUserObject)
            .catch(error => {
                assert.equal(error.status, 422);
                const body = JSON.parse(error.response.text);
                assert.equal(body.status, false);
                assert.equal(body.message, "Your password must be atleast 8 characters with one upper case letter, one lower case letter, one number, and one special character");
            });
    });

    it("it should say the username is already taken", async () => {
        const username = "admin";
        const email = "admin@gmail.com";
        const password = "Password1234!@#$";
        const encryptedRegisterUserObject: AESEncryptionResult = await LoginHelpers.createRegisterUserObject(username, email, password);
        return chai.request(host)
            .post(path)
            .set("Content-Type", "application/json")
            .send(encryptedRegisterUserObject)
            .catch(error => {
                assert.equal(error.status, 409);
                const body = JSON.parse(error.response.text);
                assert.equal(body.status, false);
                assert.equal(body.message, `The username ${username} is already taken`);
            });
    });

    it("it should say the email is already taken", async () => {
        const username = "admin234";
        const email = "admin@gmail.com";
        const password = "Password1234!@#$";
        const encryptedRegisterUserObject: AESEncryptionResult = await LoginHelpers.createRegisterUserObject(username, email, password);
        return chai.request(host)
            .post(path)
            .set("Content-Type", "application/json")
            .send(encryptedRegisterUserObject)
            .catch(error => {
                assert.equal(error.status, 409);
                const body = JSON.parse(error.response.text);
                assert.equal(body.status, false);
                assert.equal(body.message, `The email ${email} is already associated with an account.`);
            });
    });

    it("it should say user registration was successful", async () => {
        const username = "testuser";
        const email = "testuser@gmail.com";
        const password = "Password1234!@#$";
        const encryptedRegisterUserObject: AESEncryptionResult = await LoginHelpers.createRegisterUserObject(username, email, password);
        return chai.request(host)
            .post(path)
            .set("Content-Type", "application/json")
            .send(encryptedRegisterUserObject)
            .then(async response => {
                assert.equal(response.status, 200);
                const body = response.body;
                assert.equal(body.status, true);
                const messageToTest = `Thanks for registering ${username}!` 
                assert.equal(body.message.includes(messageToTest), true);
                const messageToTestTwo = `We have sent a email to ${email}`;
                assert.equal(body.message.includes(messageToTestTwo), true);
                const result = await DatabaseHelpers.deleteUserFromDatabaseByUsername(username);
                assert.equal(result, true);
            });
    });
});