import * as mocha from "mocha";
import * as chai from "chai";
import { AESEncryptionResult, Encryption } from "../../shared/Encryption";
import { LoginUser } from "../../client/app/shared/models/user-authenication.model";
import { JsonWebTokenWorkers } from "../../server/security/JsonWebTokenWorkers";
import chaiHttp = require("chai-http");
import { UserAuthenicationDataAccess } from "../../server/data-access/UserAuthenicationDataAccess";
import { User } from "../../server/models/user";
const assert = chai.assert;
chai.use(chaiHttp);

const createLoginUserObject = async (userPassword: string, userEmail: string): Promise<AESEncryptionResult> => {
    try {
        const loginUserObject: string = JSON.stringify(new LoginUser(userPassword, userEmail));
        const encryptedObject: AESEncryptionResult = await Encryption.AESEncrypt(loginUserObject);
        return encryptedObject;
    } catch (error) {
        return new AESEncryptionResult(false, null, null);
    }
};

describe("Login User Route Test", () => {
    const host = "http://localhost:8080";
    const path = "/api/userauth/loginuser";

    it("it should return a valid Admin JSON Web Token in the http headers", async () => {
        const userPassword = "Password1234!@#$";
        const userEmail = "admin@gmail.com";
        const encryptedLoginInfo = await createLoginUserObject(userPassword, userEmail);
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
});
