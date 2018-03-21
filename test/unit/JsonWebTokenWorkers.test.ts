import * as mocha from "mocha";
import * as chai from "chai";
import jwt = require("jsonwebtoken");
import { User } from "../../server/models/user";
import { DataAccess } from "../../server/data-access/classes/DataAccess";
import { JsonWebTokenWorkers } from "../../server/security/JsonWebTokenWorkers";
import { ServerEncryption, RSA2048PrivateKeyCreationResult } from "../../server/security/ServerEncryption";
import { executeCommand } from "../helpers/FileSystemHelpers";
const assert = chai.assert;

describe("JsonWebTokenWorker class tests", () => {
    it("it should sign a json webtoken", async () => {
            const userEmail = "admin@gmail.com";
            const databaseUsers: User[] = await DataAccess.findUserLoginDetailsByEmail(userEmail);
            const privateKey: RSA2048PrivateKeyCreationResult = await ServerEncryption.createRSA2048PrivateKey();
            const token = await JsonWebTokenWorkers.signWebToken(databaseUsers[0]._id, databaseUsers[0].isAdmin, databaseUsers[0].publicKeyPairOne, databaseUsers[0].privateKeyPairTwo, privateKey.key);
            after(async () => {
                const cmd = `rm -f ${privateKey.fileName}`;
                await executeCommand(cmd);
            });
    });
});
