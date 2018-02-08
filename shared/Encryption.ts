import { AES } from "crypto-js";
import { UniqueIdentifier } from "./UniqueIdentifer";

export class Encryption {
    public static async AESEncrypt(textToEncrypt: string): Promise<AESEncryptionResult> {
        try {
            const key = await this.generateUniqueSymmetricKey();
            const cipherText = AES.encrypt(textToEncrypt, key);
            return new AESEncryptionResult(true, cipherText.toString(), null);
        } catch (error) {
            // TODO: log it somewhere.
            console.log(error);
            return new AESEncryptionResult(false, null, null);
        }
    }

    static generateUniqueSymmetricKey(): Promise<string> {
        return new Promise(resolve => {
            const key = "mulchronedigital-";
            const id = UniqueIdentifier.createGuid();
            resolve(key + id);
        });
    }
}

class AESEncryptionResult {
    public success: boolean;
    public encryptedText: string;
    public key: string;

    constructor(success: boolean, encryptedText: string, key: string) {
        this.success = success;
        this.encryptedText = encryptedText;
        this.key = key;
    }
}
