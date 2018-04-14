import { UniqueIdentifier } from "../../shared/UniqueIdentifer";
import bcrypt = require("bcryptjs");
import { RSA4096PrivateKeyCreationResult } from "./RSA4096PrivateKeyCreationResult";
import { RSA4096PublicKeyCreationResult } from "./RSA4096PublicKeyCreationResult";
import { UserChangedPasswordAction } from "../models/UserAction";
import errorLogger from "../logging/ErrorLogger";
const exec = require("child_process").exec;

export class ServerEncryption {
    public static createRSA4096PrivateKey(): Promise<RSA4096PrivateKeyCreationResult> {
        return new Promise((resolve, reject) => {
            UniqueIdentifier.createGuid()
                .then(guid => {
                    const fileName = `rsa_4096_private_${guid}.pem`;
                    const cmd = `openssl genrsa -out ${fileName} 4096} && cat ${fileName}`;
                    exec(cmd, (err, stdout, stderr) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(new RSA4096PrivateKeyCreationResult(guid, fileName, stdout.toString("base64")));
                    });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    public static createRSA4096PublicKey(fileName: string, guid: string): Promise<RSA4096PublicKeyCreationResult> {
        return new Promise((resolve, reject) => {
            const publicKeyFileName = `rsa_4096_${guid}_pub.pem`;
            const cmd = `openssl rsa -pubout -in ${fileName} -out ${publicKeyFileName} && cat ${publicKeyFileName}`;
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
                resolve(new RSA4096PublicKeyCreationResult(stdout.toString("base64"), publicKeyFileName));
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

    public static HashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!password) {
                reject(new Error("Error: The password string passed into the HashPassword(password: string) function was a falsy value"));
            }
            bcrypt.genSalt(10)
                .then(salt => {
                    return bcrypt.hash(password, salt);
                })
                .then(hashedPassword => {
                    resolve(hashedPassword);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    public static async wasNewPasswordWasntUsedInLastThirtyDays(thirtyDayOldPasswords: UserChangedPasswordAction[], newPassword: string): Promise<boolean> {
        try {
            if (!thirtyDayOldPasswords || !newPassword) {
                return false;
            }
            if (thirtyDayOldPasswords.length === 0) {
                return false;
            }
            const passwordChecks: Promise<boolean>[] = [];
            for (let i = 0; i < thirtyDayOldPasswords.length; i++) {
                const pwdCheck = this.comparedStoredHashPasswordWithLoginPassword(newPassword, thirtyDayOldPasswords[i].oldPassword);
                passwordChecks.push(pwdCheck);
            }
            const passwordCheckResults = await Promise.all(passwordChecks);
            for (let i = 0; i < passwordCheckResults.length; i++) {
                if (passwordCheckResults[i] === true) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            errorLogger.error(error);
            return false;
        }
    }

    public static comparedStoredHashPasswordWithLoginPassword(loginPassword: string, hashedPassword: string): Promise<boolean> {
        return new Promise(resolve => {
            if (!loginPassword || !hashedPassword) {
                resolve(false);
            }
            bcrypt.compare(loginPassword, hashedPassword)
                .then(result => {
                    (result) ? resolve(true) : resolve(false);
                });
        });
    }
}