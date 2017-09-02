import path = require("path");
const Promise = require("bluebird");
const jwt = Promise.promisifyAll(require("jsonwebtoken"));
const fs = Promise.promisifyAll(require("fs"));
import { Request, Response, NextFunction } from "express";

namespace Globals {

    export class JsonWebToken {
    
        public static getPrivateKey(req: Request, res: Response, next: NextFunction): any {
            fs.readFileAsync(path.join(__dirname, "../ssl/private.pem"), "utf8")
                .then((privateKey) => {
                    res.locals.privateKey = privateKey;
                    next();
                 })
                .catch((error: Error) => {
                    next(error);
                });
        }
    
        public static signJsonWebToken(req: Request, res: Response, next: NextFunction): any {
            // TODO: res.locals.newUserToken is currently just for testing purposes we dont need to send the entire client object to the browser.
            jwt.signAsync(res.locals.user, res.locals.privateKey, { algorithm: "RS256", expiresIn: 86400 })
                .then((token) => {
                    res.locals.newUserToken = token;
                    next();
                })
                .catch((error: Error) => {
                     return next(error);
                });
        }
    
        public static getPublicKey(req: Request, res: Response, next: NextFunction): any {
            fs.readFileAsync(path.join(__dirname, "../ssl/public.pem"), "utf-8")
                .then((publicKey) => {
                    res.locals.publicKey = publicKey;
                     return next();
                })
                .catch((error: Error) => {
                     return next(error);
                });
        }
    
        public static verifiyJsonWebToken(req: Request, res: Response, next: NextFunction): any {
            jwt.verifyAsync(req.headers["x-access-token"], res.locals.publicKey)
                .then((decodedToken) => {
                    res.locals.decodedToken = decodedToken;
                    return next();
                })
                .catch((error: Error) => {
                    return next(error);
                });
        }
    }
}
