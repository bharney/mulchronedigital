export class RSA4096PrivateKeyCreationResult {
    public guid: string;
    public fileName: string;
    public key: string;

    constructor(guid: string, fileName: string, key: string) {
        this.guid = guid;
        this.fileName = fileName;
        this.key = key;
    }
}