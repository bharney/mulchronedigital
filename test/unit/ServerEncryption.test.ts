import * as mocha from "mocha";
import * as chai from "chai";
import { ServerEncryption } from "../../server/security/ServerEncryption";
import { executeCommand } from "../helpers/FileSystemHelpers";
import { RSA4096PrivateKeyCreationResult } from "../../server/security/RSA4096PrivateKeyCreationResult";
import { RSA4096PublicKeyCreationResult } from "../../server/security/RSA4096PublicKeyCreationResult";
import { UserChangedPasswordAction, UserChangedUsernameAction } from "../../server/models/UserAction";
const assert = chai.assert;
const exec = require("child_process").exec;

const verifyRsaPrivateKey = async (keyFilename: string): Promise<string> => {
    try {
        const cmd = `openssl rsa -in ${keyFilename} -check`;
        return await executeCommand(cmd);
    } catch (error) {
        return null;
    }
};

const verifyRsaPublicKey = async (keyFileName: string): Promise<string> => {
    try {
        const cmd = `openssl rsa -inform PEM -pubin -in ${keyFileName} -text -noout`;
        return await executeCommand(cmd);
    } catch (error) {
        return null;
    }
};

describe("ServerEncryption class tests", () => {
    it("should create a valid RSA private Key", async () => {
        const privateKey: RSA4096PrivateKeyCreationResult = await ServerEncryption.createRSA4096PrivateKey();
        const verifyResult = await verifyRsaPrivateKey(privateKey.fileName);
        assert.equal(verifyResult.includes("RSA key ok"), true);
        after(async () => {
            const cmd = `rm -f ${privateKey.fileName}`;
            await executeCommand(cmd);
        });
    });

    it("it should create a valid RSA public key", async () => {
        const privateKey: RSA4096PrivateKeyCreationResult = await ServerEncryption.createRSA4096PrivateKey();
        const publicKey: RSA4096PublicKeyCreationResult = await ServerEncryption.createRSA4096PublicKey(privateKey.fileName, privateKey.guid);
        const validPublicKeyResponse = await verifyRsaPublicKey(publicKey.fileName);
        assert.equal(validPublicKeyResponse.includes("Public-Key: (4096 bit)"), true);
        after(async () => {
            const cmd = `rm -f ${privateKey.fileName}`;
            const cmdTwo = `rm -f ${publicKey.fileName}`;
            await executeCommand(cmd);
            await executeCommand(cmdTwo);
        });
    });

    it("it should delete the public and private keys from the file system", async () => {
        const privateKey: RSA4096PrivateKeyCreationResult = await ServerEncryption.createRSA4096PrivateKey();
        const publicKey: RSA4096PublicKeyCreationResult = await ServerEncryption.createRSA4096PublicKey(privateKey.fileName, privateKey.guid);
        const deleteKeysResult = await ServerEncryption.deleteKeysFromFileSystem(privateKey.fileName, publicKey.fileName);
        assert.equal(deleteKeysResult, true);
    });

    const passwordToHash = "Password1234!@#$";
    let hashedPassword;
    it("it should hash a password", async () => {
        hashedPassword = await ServerEncryption.HashPassword(passwordToHash);
        assert.equal(passwordToHash.includes("Error:"), false);
    });

    it("it should compare the hashed password with the unhashed password as true", async () => {
        const result = await ServerEncryption.comparedStoredHashPasswordWithLoginPassword(passwordToHash, hashedPassword);
        assert.equal(result, true);
    });

    it("it should compare the hashed pasword with the unhashed password as false", async () => {
        const badPassword = "klasdkjdsajklasdjkl";
        const result = await ServerEncryption.comparedStoredHashPasswordWithLoginPassword(badPassword, hashedPassword);
        assert.equal(result, false);
    });

    it("it should throw an error when attempting to hash an empty string", async () => {
        try {
            hashedPassword = await ServerEncryption.HashPassword("");
        } catch (error) {
            const errorMessageToTest = "Error: The password string passed into the HashPassword(password: string) function was a falsy value";
            assert.equal(error.toString().includes(errorMessageToTest), true);
        }
    });

    it("it should create a RSA 4096 key pair and delete them from the file system", async () => {
        const privateKey: RSA4096PrivateKeyCreationResult = await ServerEncryption.createRSA4096PrivateKey();
        const publicKey: RSA4096PublicKeyCreationResult = await ServerEncryption.createRSA4096PublicKey(privateKey.fileName, privateKey.guid);
        const deleteResult = await ServerEncryption.deleteKeysFromFileSystem(privateKey.fileName, publicKey.fileName);
        assert.equal(deleteResult, true);
    });

    it("it should say the new password hasn't been used in thirty days", async () => {
        const oldPasswords = ["ThisIsTheFirstOldPassword", "ThisIsAnotherTestPassword!@#$2", "Tesing1234ASASDKLJ"];
        const userChangedPasswordActions: UserChangedPasswordAction[] = [];
        const newPassword = "ThisIsANewPassword123!@#";
        for (let i = 0; i < oldPasswords.length; i++) {
            const hashedPwd = await ServerEncryption.HashPassword(oldPasswords[i]);
            userChangedPasswordActions.push(new UserChangedPasswordAction(null, null, null, hashedPassword));
        }
        const checkResult = await ServerEncryption.wasNewPasswordWasntUsedInLastThirtyDays(userChangedPasswordActions, newPassword);
        assert.equal(checkResult, false);
    });

    it("it should say the new password has been used in the last thirty days", async () => {
        const oldPasswords = ["ThisIsTheFirstOldPassword", "ThisIsAnotherTestPassword!@#$2", "Tesing1234ASASDKLJ"];
        const userChangedPasswordActions: UserChangedPasswordAction[] = [];
        const newPassword = "ThisIsTheFirstOldPassword";
        for (let i = 0; i < oldPasswords.length; i++) {
            const hashedPwd = await ServerEncryption.HashPassword(oldPasswords[i]);
            userChangedPasswordActions.push(new UserChangedPasswordAction(null, null, null, hashedPwd));
        }
        const checkResult = await ServerEncryption.wasNewPasswordWasntUsedInLastThirtyDays(userChangedPasswordActions, newPassword);
        assert.equal(checkResult, true);
    });

    it("it should return false because a null value was passed into the oldPasswordArray parameter checkNewPasswordWasntUsedInLastThirtyDays(thirtyDayOldPasswords: UserChangedPasswordAction[], newPassword: string)", async () => {
        const checkResult = await ServerEncryption.wasNewPasswordWasntUsedInLastThirtyDays(null, "newPassword");
        assert.equal(checkResult, false);
    });

    it("it should return false because an empty array was passed as a parameter into checkNewPasswordWasntUsedInLastThirtyDays(thirtyDayOldPasswords: UserChangedPasswordAction[], newPassword: string)", async () => {
        const emptyArray = [];
        const checkResult = await ServerEncryption.wasNewPasswordWasntUsedInLastThirtyDays(emptyArray, "newPassword");
        assert.equal(checkResult, false);
    });

    it("it should return false because a null value was into newPassword at checkNewPasswordWasntUsedInLastThirtyDays(thirtyDayOldPasswords: UserChangedPasswordAction[], newPassword: string)", async () => {
        const arr = ["testdata", "welcome home", "world"];
        const oldPasswords: UserChangedUsernameAction[] = [];
        for (let i = 0; i < arr.length; i++) {
            oldPasswords.push(new UserChangedUsernameAction(null, null, null, arr[i]));
        }
        const checkResult = await ServerEncryption.wasNewPasswordWasntUsedInLastThirtyDays(oldPasswords, null);
        assert.equal(checkResult, false);
    });
});
