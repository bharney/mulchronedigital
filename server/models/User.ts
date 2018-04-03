import bcrypt = require("bcryptjs");
import { UserIpAddress } from "../routes/classes/UserIpAddress";
import errorLogger from "../logging/ErrorLogger";
import ProfileImage from "./ProfileImage";
import { ServerEncryption } from "../security/ServerEncryption";
import { RSA4096PrivateKeyCreationResult } from "../security/RSA4096PrivateKeyCreationResult";
import { RSA4096PublicKeyCreationResult } from "../security/RSA4096PublicKeyCreationResult";

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
  public jsonWebTokenPrivateKey: string;
  public jsonWebTokenPublicKey: string;

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
      this.password = await ServerEncryption.HashPassword(this.password);
      const privateKeyResultPairOne: RSA4096PrivateKeyCreationResult = await ServerEncryption.createRSA4096PrivateKey();
      const publicKeyResultPairOne: RSA4096PublicKeyCreationResult = await ServerEncryption.createRSA4096PublicKey(privateKeyResultPairOne.fileName, privateKeyResultPairOne.guid);
      await ServerEncryption.deleteKeysFromFileSystem(privateKeyResultPairOne.fileName, publicKeyResultPairOne.fileName);
      this.privateKeyPairOne = privateKeyResultPairOne.key;
      this.publicKeyPairOne = publicKeyResultPairOne.key;
      const privateKeyResultPairTwo: RSA4096PrivateKeyCreationResult = await ServerEncryption.createRSA4096PrivateKey();
      const publicKeyResultPairTwo: RSA4096PublicKeyCreationResult = await ServerEncryption.createRSA4096PublicKey(privateKeyResultPairTwo.fileName, privateKeyResultPairTwo.guid);
      await ServerEncryption.deleteKeysFromFileSystem(privateKeyResultPairTwo.fileName, publicKeyResultPairTwo.fileName);
      this.privateKeyPairTwo = privateKeyResultPairTwo.key;
      this.publicKeyPairTwo = publicKeyResultPairTwo.key;
      const result = true;
      return result;
    } catch (error) {
      errorLogger.error(error);
      const result = false;
      return result;
    }
  }

  public async updateUserPassword(): Promise<boolean> {
    try {
      this.password = await ServerEncryption.HashPassword(this.password);
      this.modifiedAt = new Date();
      return true;
    } catch (error) {
      errorLogger.error(error);
      return false;
    }
  }
}