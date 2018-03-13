import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");
const assert = chai.assert;
chai.use(chaiHttp);

import { ContactMe } from "../../../mulchronedigital.service1/messages/ContactMe";
import { Encryption } from "../../shared/Encryption";

const encryptContactMeObject = (userName: string, userEmail: string, message: string) => {
    return new Promise((resolve, reject) => {
        const contactMeObject = JSON.stringify(new ContactMe(userName, userEmail, message));
        Encryption.AESEncrypt(contactMeObject)
            .then(encryptedObject => {
                resolve(encryptedObject);
            })
            .catch(error => {
                reject(error);
            });
    });
};

describe("Contact Me Router Test", () => {
    const host = "http://localhost:8080";
    const path = "/api/home/contactme";
    it("it should be a stauts code of 200, return application/json, a text status of true, and the message should contain the username and email passed in", (done) => {
        const userName = "Michael Mulchrone";
        const userEmail = "mtmulch2@gmail.com";
        const message = "This is a test message for the contact me api route. This will return a valid response";
        encryptContactMeObject(userName, userEmail, message)
            .then(encrypted => {
                chai.request(host)
                    .post(path)
                    .set("Content-Type", "application/json")
                    .send(encrypted)
                    .end((error, response) => {
                        assert.equal(response.status, 200);
                        assert.equal(response.type, "application/json");
                        const responseText = JSON.parse(response.text);
                        assert.equal(responseText.status, true);
                        assert.equal(responseText.message.includes(userName), true);
                        assert.equal(responseText.message.includes(userEmail), true);
                        done();
                    });
            });
    });

    it("it should return a status code of 422, return application/json, text status of false, message should say username is not long enough ", (done) => {
        const userName = "Mi";
        const userEmail = "mtmulch2@gmail.com";
        const message = "This is a test message for the contact me api route.";
        encryptContactMeObject(userName, userEmail, message)
            .then(encrypted => {
                chai.request(host)
                    .post(path)
                    .set("Content-Type", "application/json")
                    .send(encrypted)
                    .end((error, response) => {
                        assert.equal(response.status, 422);
                        assert.equal(response.type, "application/json");
                        const responseText = JSON.parse(response.text);
                        assert.equal(responseText.status, false);
                        assert.equal(responseText.message.includes("not long enough"), true);
                        done();
                    });
            });
    });
});
