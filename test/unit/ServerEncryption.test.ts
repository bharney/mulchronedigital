import * as mocha from "mocha";
import * as chai from "chai";
import { ServerEncryption, RSA2048PrivateKeyCreationResult, RSA2048PublicKeyCreationResult } from '../../server/security/ServerEncryption';
import { executeCommand } from "../helpers/FileSystemHelpers";
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
        const privateKey: RSA2048PrivateKeyCreationResult = await ServerEncryption.createRSA2048PrivateKey();
        const verifyResult = await verifyRsaPrivateKey(privateKey.fileName);
        assert.equal(verifyResult.includes("RSA key ok"), true);
        after(async () => {
            const cmd = `rm -f ${privateKey.fileName}`;
            await executeCommand(cmd);
        });
    });

    it("it should create a valid RSA public key", async () => {
        const privateKey: RSA2048PrivateKeyCreationResult = await ServerEncryption.createRSA2048PrivateKey();
        const publicKey: RSA2048PublicKeyCreationResult = await ServerEncryption.createRSA2048PublicKey(privateKey.fileName, privateKey.guid);
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
        const privateKey: RSA2048PrivateKeyCreationResult = await ServerEncryption.createRSA2048PrivateKey();
        const publicKey: RSA2048PublicKeyCreationResult = await ServerEncryption.createRSA2048PublicKey(privateKey.fileName, privateKey.guid);
        const deleteKeysResult = await ServerEncryption.deleteKeysFromFileSystem(privateKey.fileName, publicKey.fileName);
        assert.equal(deleteKeysResult, true);
    });
});
