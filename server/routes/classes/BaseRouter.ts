import { NextFunction, Request, Response } from "express";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { JsonWebToken } from "../../../shared/JsonWebToken";
import { User } from "../../models/user";
import { Encryption } from "../../../shared/Encryption";
import { UserAuthenicationDataAccess } from "../../data-access/UserAuthenicationDataAccess";

export abstract class BaseRouter {

  public async checkForUserJsonWebToken(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: this looks god awful. FIX IT!
      const headerToken = req.headers["user-authenication-token"];
      if (headerToken === null) {
        return res.status(401).json(ResponseMessages.noJsonWebTokenInHeader());
      }
      if (!await JsonWebTokenWorkers.verifiyJsonWebToken(headerToken)) {
        return res.status(409).json(ResponseMessages.jsonWebTokenExpired());
      }
      res.locals.token = await JsonWebTokenWorkers.getDecodedJsonWebToken(headerToken);
      if (!res.locals.token) {
        return res.status(503).json(ResponseMessages.generalError());
      }
      const databaseUsers: User[] = await UserAuthenicationDataAccess.getJSONWebTokenOfActiveUserByUserId(res.locals.token.id);
      if (databaseUsers.length <= 0) {
        // send user message and redirect them client side to login screen or whatever.
        return res.status(503).json(ResponseMessages.generalError());
      }
      const isUserActive = databaseUsers[0].isActive;
      if (isUserActive === undefined || !isUserActive) {
        return res.status(503).json(ResponseMessages.userIsNotActive());
      }
      if (!await JsonWebTokenWorkers.verifiyJsonWebToken(databaseUsers[0].jsonToken)) {
        return res.status(409).json(ResponseMessages.jsonWebTokenExpired());
      }
      const decodedDbToken: JsonWebToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(databaseUsers[0].jsonToken);
      if (!await JsonWebTokenWorkers.comparedHeaderTokenWithDbToken(res.locals.token, decodedDbToken)) {
        return res.status(409).json(ResponseMessages.jsonWebTokenDoesntMatchStoredToken());
      }
      next();
    } catch (error) {
      // TODO: error handler
      console.log(error);
      return res.status(503).json(ResponseMessages.generalError());
    }
  }

  public async decryptRequestBody(req: Request, res: Response, next: NextFunction) {
    try {
      if (await !Encryption.verifiyUniqueSymmetricKey(req.body.key)) {
        return res.status(503).json(ResponseMessages.generalError());
      }
      const newRequestBody = await Encryption.AESDecrypt(req.body.encryptedText, req.body.key);
      req.body = JSON.parse(newRequestBody);
      next();
    } catch (error) {
      // TODO: log decryption error.
      return res.status(503).json(ResponseMessages.generalError());
    }
  }
}
