import { AES } from "crypto-js";
import { UniqueIdentifier } from "./UniqueIdentifer";
import * as CryptoJS from "crypto-js";

export class Encryption {

    public static async AESEncrypt(textToEncrypt: string): Promise<AESEncryptionResult> {
        try {
            const key = await this.generateUniqueSymmetricKey();
            const cipherText = AES.encrypt(textToEncrypt, key);
            return new AESEncryptionResult(true, cipherText.toString(), key);
        } catch (error) {
            // TODO: log it somewhere.
            console.log(error);
            return new AESEncryptionResult(false, null, null);
        }
    }

    public static async AESDecrypt(textToDecrypt: string, symmetricKey: string) {
        try {
            const decryptedBytes = AES.decrypt(textToDecrypt, symmetricKey);
            return decryptedBytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {

        }
    }

    static async generateUniqueSymmetricKey(): Promise<string> {
        try {
            const key = "mulchronedigital ";
            const id = await UniqueIdentifier.createGuid();
            return key + id;
        } catch (error) {

        }
    }

    static async verifiyUniqueSymmetricKey(symmetricKey: string): Promise<boolean> {
        try {
            if (!symmetricKey.includes("mulchronedigital")) {
                return false;
            }
            const splitKey = symmetricKey.split(" ");
            if (!await UniqueIdentifier.testUniqueIdentifer(splitKey[1])) {
                return false;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

export class AESEncryptionResult {
    public success: boolean;
    public encryptedText: string;
    public key: string;

    constructor(success: boolean, encryptedText: string, key: string) {
        this.success = success;
        this.encryptedText = encryptedText;
        this.key = key;
    }
}
