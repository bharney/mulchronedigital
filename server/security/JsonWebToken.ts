const promise = require("bluebird");
const fs = promise.promisifyAll(require("fs"));
import path = require("path");
import jwt = require("jsonwebtoken");

export class JsonWebToken {

  public static async signSignWebToken(id: string, isAdmin: boolean): Promise<string> {
    try {
      const userObject = this.createSignWebTokenUserObject(id, isAdmin);
      const privateKey = await this.getPrivateKey();
      const token = await jwt.sign(userObject, privateKey, { algorithm: "RS256", expiresIn: 86400 });
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

  public static async verifiyJsonWebToken(token) {
      try {
        const publicKey = await this.getPublicKey();
        const decodedToken: IJsonWebToken = await jwt.verify(token, publicKey);
        if ()
      } catch (error) {
        console.log(error);
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
