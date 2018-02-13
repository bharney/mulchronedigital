import bcrypt = require("bcryptjs");
import { UserIpAddress } from "../routes/classes/UserIpAddress";
import { UniqueIdentifier } from "../../shared/UniqueIdentifer";
const exec = require("child_process").exec;

export class User {
  public _id?: string;
  public isActive: boolean;
  public rememberMe: boolean;
  public username: string;
  public email: string;
  public password: string;
  public isAdmin: boolean;
  public createdAt: Date;
  public modifiedAt: Date;
  public profileImage: ProfileImage;
  public jsonToken: string;
  public ipAddresses: UserIpAddress[];
  public privateKeyPairOne: string;
  public publicKeyPairOne: string;
  public privateKeyPairTwo: string;
  public publicKeyPairTwo: string;

  constructor(username: string, email?: string, password?: string, ipAddress?: UserIpAddress, rememberMe?: boolean) {
    this.isActive = false;
    (rememberMe) ? this.rememberMe = true : this.rememberMe = false;
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
    this.profileImage = new ProfileImage();
    this.modifiedAt = new Date();
    this.ipAddresses = [];
    if (ipAddress) {
      this.ipAddresses.push(ipAddress);
    }
  }

  public async SetupNewUser(): Promise<boolean> {
    try {
      this.createdAt = new Date();
      this.password = await this.HashPassword();
      const privateKeyResultPairOne: RSA2048PrivateKeyCreationResult = await this.createRSA2048PrivateKey();
      const publicKeyResultPairOne: RSA2048PublicKeyCreationResult = await this.createRSA2048PublicKey(privateKeyResultPairOne.fileName, privateKeyResultPairOne.guid);
      await this.deleteKeysFromFileSystem(privateKeyResultPairOne.fileName, publicKeyResultPairOne.fileName);
      this.privateKeyPairOne = privateKeyResultPairOne.key;
      this.publicKeyPairOne = publicKeyResultPairOne.key;
      const privateKeyResultPairTwo: RSA2048PrivateKeyCreationResult = await this.createRSA2048PrivateKey();
      const publicKeyResultPairTwo: RSA2048PublicKeyCreationResult = await this.createRSA2048PublicKey(privateKeyResultPairTwo.fileName, privateKeyResultPairTwo.guid);
      await this.deleteKeysFromFileSystem(privateKeyResultPairTwo.fileName, publicKeyResultPairTwo.fileName);
      this.privateKeyPairTwo = privateKeyResultPairTwo.key;
      this.publicKeyPairTwo = publicKeyResultPairTwo.key;
      const result = true;
      return result;
    } catch (error) {
      console.log(error);
      const result = false;
      return result;
    }
  }

  createRSA2048PrivateKey(): Promise<RSA2048PrivateKeyCreationResult> {
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

  createRSA2048PublicKey(fileName: string, guid: string): Promise<RSA2048PublicKeyCreationResult> {
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

  deleteKeysFromFileSystem(fileNameOne: string, fileNameTwo: string) {
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

  public async updateUserPassword(): Promise<boolean> {
    try {
      this.password = await this.HashPassword();
      this.modifiedAt = new Date();
      return true;
    } catch (error) {
      // TODO: error handling? Logging?
      return false;
    }
  }

  // TODO: throw this in a helper class or something
  private HashPassword(): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10)
        .then(salt => {
          return bcrypt.hash(this.password, salt);
        })
        .then(hashedPassword => {
          resolve(hashedPassword);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

class ProfileImage {
  public public_id: string;
  public version: number;
  public signature: string;
  public width: number;
  public height: number;
  public format: string;
  public resource_type: string;
  public created_at: string;
  public tags: string[];
  public bytes: number;
  public type: string;
  public etag: string;
  public placeholder: boolean;
  public url: string;
  public secure_url: string;
  public original_filename: string;
}

class RSA2048PrivateKeyCreationResult {
  public guid: string;
  public fileName: string;
  public key: string;

  constructor(guid: string, fileName: string, key: string) {
    this.guid = guid;
    this.fileName = fileName;
    this.key = key;
  }
}

class RSA2048PublicKeyCreationResult {
  public key: string;
  public fileName: string;

  constructor(key: string, publicKeyFileName: string) {
    this.key = key;
    this.fileName = publicKeyFileName;
  }
}
