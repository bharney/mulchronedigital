const promise = require("bluebird");
const fs = promise.promisifyAll(require("fs"));
import path = require("path");
import jwt = require("jsonwebtoken");
import { JsonWebToken } from "../../shared/interfaces/IJsonWebToken";

export class JsonWebTokenWorkers {

  public static async signSignWebToken(id: string, isAdmin: boolean): Promise<string> {
    try {
      const userObject = this.createSignWebTokenUserObject(id, isAdmin);
      const privateKey = await this.getPrivateKey();
      const token = await jwt.sign(userObject, privateKey, { algorithm: "RS256", expiresIn: 1 });
      return token;
    } catch (error) {
      throw error;
    }
  }

  public static createSignWebTokenUserObject(id: string, isAdmin: boolean): object {
    return {
      "id": id,
      "isAdmin": isAdmin
    };
  }

  public static getPrivateKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFileAsync(path.join(process.cwd() + "/server/security/ssl/private.pem"), "utf8")
        .then((privateKey) => {
          resolve(privateKey);
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  public static async verifiyJsonWebToken(token): Promise<boolean> {
    try {
      const publicKey = await this.getPublicKey();
      await jwt.verify(token, publicKey);
      return true;
    } catch (error) {
      // TODO: log error?
      return false;
    }
  }

  public static async getDecodedJsonWebToken(token): Promise<any> {
    try {
      const decodedToken = jwt.decode(token);
      const tokenObject: JsonWebToken = new JsonWebToken(decodedToken["id"], decodedToken["isAdmin"], decodedToken["iat"], decodedToken["exp"]);
      return tokenObject;
    } catch (error) {
      return null;
    }
  }

  public static createDecodedTokenUserObject(id: string, isAdmin: boolean, exp): object {
    return {};
  }

  public static getPublicKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFileAsync(path.join(process.cwd(), "/server/security/ssl/public.pem"), "utf-8")
        .then((publicKey) => {
          resolve(publicKey);
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }
}
