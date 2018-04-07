import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import { AESEncryptionResult } from "../../shared/Encryption";
import LoginHelpers from "../helpers/LoginHelpers";
import { DatabaseHelpers } from "../helpers/DatabaseHelpers";
import { JsonWebTokenWorkers } from "../../server/security/JsonWebTokenWorkers";
const assert = chai.assert;
chai.use(chaiHttp);

const compareTokens = async (headerToken, dbToken) => {
    try {
        const decodedHeader = await JsonWebTokenWorkers.getDecodedJsonWebToken(headerToken);
        const decodedNewDbToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(dbToken);
        const comparisonResult = await JsonWebTokenWorkers.comparedHeaderTokenWithDbToken(decodedHeader, decodedNewDbToken);
        return comparisonResult;
    } catch (error) {
        return false;
    }
}

describe("RefreshToken Route Tests", () => {
    const host = "http://localhost:8080";
    const path = "/api/userauth/refreshtoken";
    // I am not going to test the checkForUserJsonWebToken middleware in this test.
    // there already is a seperate test file for that.
    it("it should return a new json webtoken", async () => {
        const username = "admin";
        const headerJsonToken = await DatabaseHelpers.getUsersJsonWebTokenByUsername(username);
        return chai.request(host)
            .get(path)
            .set("mulchronedigital-token", headerJsonToken)
            .then(async response => {
                assert.equal(response.status, 200);
                const body = response.body;
                assert.equal(body.status, true);
                assert.equal(body.message, `Welcome back ${username}`);
                assert.equal(typeof (body.token), typeof (""));
                assert.notEqual(body.token, headerJsonToken);
                assert.equal(await compareTokens(headerJsonToken, body.token), false);
            });
    });
});