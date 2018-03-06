import { UniqueIdentifier } from "../../shared/UniqueIdentifer";
const exec = require("child_process").exec;

export class ServerEncryption {
    public static createRSA2048PrivateKey(): Promise<RSA2048PrivateKeyCreationResult> {
        return new Promise((resolve, reject) => {
            UniqueIdentifier.createGuid()
                .then(guid => {
                    const fileName = `rsa_4096_private_${guid}.pem`;
                    const cmd = `openssl genrsa -out ${fileName} 4096} && cat ${fileName}`;
                    exec(cmd, (err, stdout, stderr) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(new RSA2048PrivateKeyCreationResult(guid, fileName, stdout.toString("base64")));
                    });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    public static createRSA2048PublicKey(fileName: string, guid: string): Promise<RSA2048PublicKeyCreationResult> {
        return new Promise((resolve, reject) => {
            const publicKeyFileName = `rsa_4096_${guid}_pub.pem`;
            const cmd = `openssl rsa -pubout -in ${fileName} -out ${publicKeyFileName} && cat ${publicKeyFileName}`;
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
                resolve(new RSA2048PublicKeyCreationResult(stdout.toString("base64"), publicKeyFileName));
            });
        });
    }

    public static deleteKeysFromFileSystem(fileNameOne: string, fileNameTwo: string) {
        return new Promise((resolve, reject) => {
            const cmdOne = `rm -f ${fileNameOne}`;
            const cmdTwo = `rm -f ${fileNameTwo}`;
            exec(cmdOne, (err, stdout, stderr) => {
                if (!err) {
                    exec(cmdTwo, (err, stdout, stderr) => {
                        if (!err) {
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    });
                } else {
                    reject(false);
                }
            });
        });
    }
}

export class RSA2048PrivateKeyCreationResult {
    public guid: string;
    public fileName: string;
    public key: string;

    constructor(guid: string, fileName: string, key: string) {
        this.guid = guid;
        this.fileName = fileName;
        this.key = key;
    }
}

export class RSA2048PublicKeyCreationResult {
    public key: string;
    public fileName: string;

    constructor(key: string, publicKeyFileName: string) {
        this.key = key;
        this.fileName = publicKeyFileName;
    }
}