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