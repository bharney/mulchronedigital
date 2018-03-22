import * as mocha from "mocha";
import * as chai from "chai";
import jwt = require("jsonwebtoken");
import { User } from "../../server/models/user";
import { DataAccess } from "../../server/data-access/classes/DataAccess";
import { JsonWebTokenWorkers } from "../../server/security/JsonWebTokenWorkers";
import { ServerEncryption, RSA2048PrivateKeyCreationResult } from "../../server/security/ServerEncryption";
import { executeCommand } from "../helpers/FileSystemHelpers";
import { JsonWebToken } from "../../shared/JsonWebToken";
const assert = chai.assert;

const deletePrivateKey = async (filename) => {
    const cmd = `rm -f ${filename}`;
    await executeCommand(cmd);
};

describe("JsonWebTokenWorker class tests", () => {
    const userEmail: string = "admin@gmail.com";
    let databaseUsers: User[];
    let decodedToken: JsonWebToken;
    let token: string;
    before(async () => {
        databaseUsers = await DataAccess.findUserLoginDetailsByEmail(userEmail);
    });

    it("it should return a object with properties for a json web token", async () => {
        const signWebTokenObject: object = JsonWebTokenWorkers.createSignWebTokenUserObject(databaseUsers[0]._id, databaseUsers[0].isAdmin, databaseUsers[0].publicKeyPairOne, databaseUsers[0].privateKeyPairTwo);
        assert.equal(signWebTokenObject.hasOwnProperty("id"), true);
        assert.equal(signWebTokenObject.hasOwnProperty("isAdmin"), true);
        assert.equal(signWebTokenObject.hasOwnProperty("publicKeyPairOne"), true);
        assert.equal(signWebTokenObject.hasOwnProperty("privateKeyPairTwo"), true);
    });

    it("it should sign a json webtoken", async () => {
        const privateKey: RSA2048PrivateKeyCreationResult = await ServerEncryption.createRSA2048PrivateKey();
        token = await JsonWebTokenWorkers.signWebToken(databaseUsers[0]._id, databaseUsers[0].isAdmin, databaseUsers[0].publicKeyPairOne, databaseUsers[0].privateKeyPairTwo, privateKey.key);
        assert.equal(typeof (token), typeof (""));
        after(async () => {
            await deletePrivateKey(privateKey.fileName);
        });
    });

    // TODO: this needs to verify 
    // it("it should verify a jsonwebtoken with a result of true", async () => {
    //     const result = await JsonWebTokenWorkers.verifiyJsonWebToken(token, databaseUsers[0].jsonWebTokenPublicKey);
    //     assert.equal(result, true);
    // });

    it("it should verify a jsonwebtoken with a result of false", async () => {
        const result = await JsonWebTokenWorkers.verifiyJsonWebToken(token, null);
        assert.equal(result, false);
    });

    it("it should decode a jsonwebtoken", async () => {
        decodedToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(token);
        assert.equal(decodedToken.hasOwnProperty("id"), true);
        assert.equal(decodedToken.hasOwnProperty("isAdmin"), true);
        assert.equal(decodedToken.hasOwnProperty("iat"), true);
        assert.equal(decodedToken.hasOwnProperty("exp"), true);
        assert.equal(decodedToken.hasOwnProperty("publicKeyPairOne"), true);
        assert.equal(decodedToken.hasOwnProperty("privateKeyPairTwo"), true);
    });

    it("it should compare two different jsonwebtoken and return false", async () => {
        try {
            const secondUserEmail: string = "basicuser@gmail.com";
            const secondUsers: User[] = await DataAccess.findUserLoginDetailsByEmail(secondUserEmail);
            var secondUserPrivateKey: RSA2048PrivateKeyCreationResult = await ServerEncryption.createRSA2048PrivateKey();
            const secondUserToken = await JsonWebTokenWorkers.signWebToken(secondUsers[0]._id, secondUsers[0].isAdmin, secondUsers[0].publicKeyPairOne, secondUsers[0].privateKeyPairTwo, secondUserPrivateKey.key);
            const decodedSecondUserToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(secondUserToken);
            const result = await JsonWebTokenWorkers.comparedHeaderTokenWithDbToken(decodedToken, decodedSecondUserToken);
        } catch (error) {
            assert.equal(error, false);
            after(async () => {
                await deletePrivateKey(secondUserPrivateKey.fileName);
            });
        }
    });

    it("it should compare a jsonwebtoken with a valid jsonwebtoken and return true", async () => {
        const result = await JsonWebTokenWorkers.comparedHeaderTokenWithDbToken(decodedToken, decodedToken);
        assert.equal(result, true);
    });
});
