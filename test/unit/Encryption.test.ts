import * as mocha from "mocha";
import * as chai from "chai";
const assert = chai.assert;
import { UniqueIdentifier } from "../../shared/UniqueIdentifer";
import { Encryption } from "../../shared/Encryption";


describe("Encryption class Tests", () => {
    it("it should return a globally unique identifer prefixed with mulchronedigital", async () => {
        const key = await Encryption.generateUniqueSymmetricKey();
        const splitKey = key.split(" ");
        assert.equal(splitKey[0].includes("mulchronedigital"), true);
        assert.equal(await UniqueIdentifier.testUniqueIdentifer(splitKey[1]), true);
    });

    it("it should encrypt a text string and return a AESEncryptionResult object with a success of true, an encrypted text message, and a symmetric key", async () => {
            const messageToEncrypt = "This is a test message to encrypt";
            const encryptionResult = await Encryption.AESEncrypt(messageToEncrypt);
            assert.equal(encryptionResult.success, true);
            assert.notEqual(encryptionResult.encryptedText, messageToEncrypt);
            assert.equal(await Encryption.verifiyUniqueSymmetricKey(encryptionResult.key), true);
    });

    it ("it should encrypt a text string, return a AESEncryptionResult and decrypt the encrypted Message", async () => {
        const messageToEncrypt = "This is another test message to encrypt";
        const encryptionResult = await Encryption.AESEncrypt(messageToEncrypt);
        assert.equal(encryptionResult.success, true);
        assert.notEqual(encryptionResult.encryptedText, messageToEncrypt);
        assert.equal(await Encryption.verifiyUniqueSymmetricKey(encryptionResult.key), true);
        const decryptedResult = await Encryption.AESDecrypt(encryptionResult.encryptedText, encryptionResult.key);
        assert.equal(messageToEncrypt, decryptedResult);
    });

    it("it should verify a uniqueSymmetricKey", async () => {
        const key = await Encryption.generateUniqueSymmetricKey();
        assert.equal(await Encryption.verifiyUniqueSymmetricKey(key), true);
    });

    it("it should return an AESEncryptionResult with a status of false", async () => {
        const messageToEncrypt = null;
        const encryptionResult = await Encryption.AESEncrypt(messageToEncrypt);
        assert.equal(encryptionResult.success, false);
        assert.equal(encryptionResult.key, null);
        assert.equal(encryptionResult.encryptedText, null);
    });
});
