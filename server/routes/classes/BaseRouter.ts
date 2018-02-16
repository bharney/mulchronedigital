import { NextFunction, Request, Response } from "express";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { Database } from "../../globals/Database";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { UsersCollection } from "../../cluster/master";
import { ObjectId } from "mongodb";
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
        const responseMessages = new ResponseMessages();
        return res.status(401).json(responseMessages.noJsonWebTokenInHeader());
      }
      if (!await JsonWebTokenWorkers.verifiyJsonWebToken(headerToken)) {
        const responseMessages = new ResponseMessages();
        return res.status(409).json(responseMessages.jsonWebTokenExpired());
      }
      res.locals.token = await JsonWebTokenWorkers.getDecodedJsonWebToken(headerToken);
      if (!res.locals.token) {
        const responseMessages = new ResponseMessages();
        return res.status(503).json(responseMessages.generalError());
      }
      const dataAccess = new UserAuthenicationDataAccess();
      const databaseUsers: User[] = await dataAccess.findActiveUserAndJsonWebTokenByUserId(res.locals.token.id);
      if (databaseUsers.length <= 0) {
        // send user message and redirect them client side to login screen or whatever.
        const responseMessages = new ResponseMessages();
        return res.status(503).json(responseMessages.generalError());
      }
      const isUserActive = databaseUsers[0].isActive;
      if (isUserActive === undefined || !isUserActive) {
        const responseMessages = new ResponseMessages();
        return res.status(503).json(responseMessages.userIsNotActive());
      }
      if (!await JsonWebTokenWorkers.verifiyJsonWebToken(databaseUsers[0].jsonToken)) {
        const responseMessages = new ResponseMessages();
        return res.status(409).json(responseMessages.jsonWebTokenExpired());
      }
      const decodedDbToken: JsonWebToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(databaseUsers[0].jsonToken);
      if (!await JsonWebTokenWorkers.comparedHeaderTokenWithDbToken(res.locals.token, decodedDbToken)) {
        const responseMessages = new ResponseMessages();
        return res.status(409).json(responseMessages.jsonWebTokenDoesntMatchStoredToken());
      }
      next();
    } catch (error) {
      // TODO: error handler
      const responseMessages = new ResponseMessages();
      console.log(error);
      return res.status(503).json(responseMessages.generalError());
    }
  }

  public async decryptRequestBody(req: Request, res: Response, next: NextFunction) {
    try {
      if (await !Encryption.verifiyUniqueSymmetricKey(req.body.key)) {
        const responseMessages = new ResponseMessages();
        return res.status(503).json(responseMessages.generalError());
      }
      const newRequestBody = await Encryption.AESDecrypt(req.body.encryptedText, req.body.key);
      req.body = JSON.parse(newRequestBody);
      next();
    } catch (error) {
      // TODO: log decryption error.
      const responseMessages = new ResponseMessages();
      return res.status(503).json(responseMessages.generalError());
    }
  }
}
