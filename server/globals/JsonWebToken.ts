const promise = require("bluebird");
const fs = promise.promisifyAll(require("fs"));
import path = require("path");
import jwt = require("jsonwebtoken");

export class JsonWebToken {

  public static async signSignWebToken(username: string, isAdmin: boolean): Promise<string> {
    try {
      const userObject = this.createSignWebTokenUserObject(username, isAdmin);
      const privateKey = await this.getPrivateKey();
      const token = await jwt.sign(userObject, privateKey, { algorithm: "RS256", expiresIn: 86400 });
      return token;
    } catch (error) {
        throw error;
    }
  }

  public static createSignWebTokenUserObject(username: string, isAdmin: boolean): object {
    return {
      "username": username,
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
  // public static signJsonWebToken(req: Request, res: Response, next: NextFunction): any {
  //     // TODO: res.locals.newUserToken is currently just for testing purposes we dont need to send the entire client object to the browser.
  //     jwt.signAsync(res.locals.user, res.locals.privateKey, { algorithm: "RS256", expiresIn: 86400 })
  //         .then((token) => {
  //             res.locals.newUserToken = token;
  //             next();
  //         })
  //         .catch((error: Error) => {
  //              return next(error);
  //         });
  // }

  // public static getPublicKey(req: Request, res: Response, next: NextFunction): any {
  //   fs.readFileAsync(path.join(__dirname, "../security/ssl/public.pem"), "utf-8")
  //     .then((publicKey) => {
  //       res.locals.publicKey = publicKey;
  //       return next();
  //     })
  //     .catch((error: Error) => {
  //       return next(error);
  //     });
  // }

  // public static verifiyJsonWebToken(req: Request, res: Response, next: NextFunction): any {
  //   jwt.verifyAsync(req.headers["x-access-token"], res.locals.publicKey)
  //     .then((decodedToken) => {
  //       res.locals.decodedToken = decodedToken;
  //       return next();
  //     })
  //     .catch((error: Error) => {
  //       return next(error);
  //     });
  // }
}
