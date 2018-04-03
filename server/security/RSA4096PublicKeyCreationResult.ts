export class RSA4096PublicKeyCreationResult {
    public key: string;
    public fileName: string;

    constructor(key: string, publicKeyFileName: string) {
        this.key = key;
        this.fileName = publicKeyFileName;
    }
}