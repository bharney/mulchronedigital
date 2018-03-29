import { NextFunction, Request, Response } from "express";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { JsonWebToken } from "../../../shared/JsonWebToken";
import { User } from "../../models/User";
import { Encryption } from "../../../shared/Encryption";
import { UserAuthenicationDataAccess } from "../../data-access/UserAuthenicationDataAccess";

export abstract class BaseRouter {

  public async checkForUserJsonWebToken(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: this looks god awful. FIX IT!
      const headerToken = req.headers["mulchronedigital-token"];
      if (!headerToken) {
        return res.status(401).json(await ResponseMessages.noJsonWebTokenInHeader());
      }
      res.locals.token = await JsonWebTokenWorkers.getDecodedJsonWebToken(headerToken);
      if (!res.locals.token) {
        return res.status(503).json(await ResponseMessages.generalError());
      }
      const databaseUsers: User[] = await UserAuthenicationDataAccess.getJSONWebTokenInfoOfActiveUserByUserId(res.locals.token.id);
      if (databaseUsers.length <= 0) {
        return res.status(401).json(await ResponseMessages.noUserFoundThatIsActive());
      }
      const isUserActive = databaseUsers[0].isActive;
      if (!isUserActive) {
        return res.status(503).json(await ResponseMessages.userIsNotActive());
      }
      const jsonToken = databaseUsers[0].jsonToken;
      const jsonTokenPublicKey = databaseUsers[0].jsonWebTokenPublicKey;
      if (!await JsonWebTokenWorkers.verifiyJsonWebToken(jsonToken, jsonTokenPublicKey)) {
        return res.status(409).json(await ResponseMessages.jsonWebTokenExpired());
      }
      const decodedDbToken: JsonWebToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(jsonToken);
      if (!await JsonWebTokenWorkers.comparedHeaderTokenWithDbToken(res.locals.token, decodedDbToken)) {
        return res.status(409).json(await ResponseMessages.jsonWebTokenDoesntMatchStoredToken());
      }
      next();
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
  }

  public async checkForAdminJsonWebToken(req: Request, res: Response, next: NextFunction) {
    try {
      if (!res.locals.token.isAdmin) {
        return res.status(503).json(await ResponseMessages.userIsNotAdmin());
      }
      next();
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
  }

  public async decryptRequestBody(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.key) {
        // TODO: validate somehow that this came from a trusted application? If not block that IP.
        return res.status(503).json(await ResponseMessages.noSymmetricKeyProvidedError());
      }
      if (!req.body.encryptedText) {
        // TODO: validate some how that this came from a trusted application? If not block that IP.
        return res.status(503).json(await ResponseMessages.noEncrypteRequestBodyTextError());
      }
      if (!await Encryption.verifiyUniqueSymmetricKey(req.body.key)) {
        return res.status(503).json(await ResponseMessages.generalError());
      }
      const newRequestBody = await Encryption.AESDecrypt(req.body.encryptedText, req.body.key);
      req.body = JSON.parse(newRequestBody);
      next();
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
  }
}
