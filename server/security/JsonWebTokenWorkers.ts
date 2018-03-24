const promise = require("bluebird");
const fs = promise.promisifyAll(require("fs"));
import path = require("path");
import jwt = require("jsonwebtoken");
import { JsonWebToken } from "../../shared/JsonWebToken";
import { UsersCollection } from "../config/master";
import { RSA2048PrivateKeyCreationResult, ServerEncryption, RSA2048PublicKeyCreationResult } from "./ServerEncryption";
import { User } from "../models/User";
import errorLogger from "../logging/ErrorLogger";

export class JsonWebTokenWorkers {

  public static async createJsonWebTokenKeyPairForUser(databaseUser: User): Promise<CreateJsonWebTokenKeyPairResult> {
    try {
      const privateKey: RSA2048PrivateKeyCreationResult = await ServerEncryption.createRSA2048PrivateKey();
      const publicKey: RSA2048PublicKeyCreationResult = await ServerEncryption.createRSA2048PublicKey(privateKey.fileName, privateKey.guid);
      await ServerEncryption.deleteKeysFromFileSystem(privateKey.fileName, publicKey.fileName);
      const token = await this.signWebToken(databaseUser._id, databaseUser.isAdmin, databaseUser.publicKeyPairOne, databaseUser.privateKeyPairTwo, privateKey.key);
      return new CreateJsonWebTokenKeyPairResult(privateKey.key, publicKey.key, token);
    } catch (error) {
      errorLogger.error(error);
    }
  }


  public static async signWebToken(id: string, isAdmin: boolean, publicKeyPairOne: string, privateKeyPairTwo: string, jsonWebTokenPrivateKey: string): Promise<string> {
    try {
      const userObject = this.createSignWebTokenUserObject(id, isAdmin, publicKeyPairOne, privateKeyPairTwo);
      const token = await jwt.sign(userObject, jsonWebTokenPrivateKey, { algorithm: "RS256", expiresIn: 86400 });
      return token;
    } catch (error) {
      throw error;
    }
  }

  public static createSignWebTokenUserObject(id: string, isAdmin: boolean, publicKeyPairOne: string, privateKeyPairTwo: string): object {
    return {
      "id": id,
      "isAdmin": isAdmin,
      "publicKeyPairOne": publicKeyPairOne,
      "privateKeyPairTwo": privateKeyPairTwo
    };
  }

  public static async verifiyJsonWebToken(jsonToken: string, jsonTokenPublicKey: string): Promise<boolean> {
    try {
      await jwt.verify(jsonToken, jsonTokenPublicKey);
      return true;
    } catch (error) {
      // TODO: log error?
      return false;
    }
  }

  public static async getDecodedJsonWebToken(token): Promise<any> {
    try {
      const decodedToken = jwt.decode(token);
      const tokenObject: JsonWebToken = new JsonWebToken(decodedToken["id"], decodedToken["isAdmin"], decodedToken["iat"], decodedToken["exp"], decodedToken["publicKeyPairOne"], decodedToken["privateKeyPairTwo"]);
      return tokenObject;
    } catch (error) {
      return null;
    }
  }

  public static comparedHeaderTokenWithDbToken(headerToken: JsonWebToken, dbToken: JsonWebToken): Promise<boolean> {
    return new Promise((resolve, reject) => {
      for (const key in headerToken) {
        if (headerToken[key] !== dbToken[key]) {
          reject(false);
        }
      }
      resolve(true);
    });
  }
}

export class CreateJsonWebTokenKeyPairResult {
  public privateKey: string;
  public publicKey: string;
  public token: string;

  constructor(privateKey: string, publicKey: string, token: string) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.token = token;
  }
}
