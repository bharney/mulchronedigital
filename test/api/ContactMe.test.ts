import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");
const expect = chai.expect;
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
    it("it should be a stauts code of 200, return application/json, a text status of true, and the message should contain the username and email passed in", () => {
        const userName = "Michael Mulchrone";
        const userEmail = "mtmulch2@gmail.com";
        const message = "This is a test message for the contact me api route. This will return a valid response";
        encryptContactMeObject(userName, userEmail, message)
            .then(encrypted => {
                return chai.request(host)
                    .post(path)
                    .set("Content-Type", "application/json")
                    .send(encrypted)
                    .then(response => {
                        expect(response.status).to.equal(200);
                        expect(response.type).to.equal("application/json");
                        const responseText = JSON.parse(response.text);
                        expect(responseText.status).to.equal(true);
                        expect(responseText.message).to.contain(userName);
                        expect(responseText.message).to.contain(userEmail);
                    })
                    .catch(error => {
                        throw error;
                    });
            });
    });
});
