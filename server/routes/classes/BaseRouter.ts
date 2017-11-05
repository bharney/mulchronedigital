import { NextFunction, Request, Response } from "express";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { Database } from "../../globals/Database";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { UsersCollection } from "../../cluster/master";
import { ObjectId } from "mongodb";
import { JsonWebToken } from "../../../shared/interfaces/IJsonWebToken";
import { User } from "../../models/user";

export abstract class BaseRouter {

  public async createStandardLocalResponseObjects(req: Request, res: Response, next: NextFunction) {
    try {
      res.locals.responseMessages = new ResponseMessages();
    } catch (error) {
      // TODO: error handler
      throw error;
    }
    next();
  }

  public async checkForUserJsonWebToken(req: Request, res: Response, next: NextFunction) {
    try {
      const headerToken = req.headers["user-authenication-token"];
      if (headerToken === null) {
        return res.json(res.locals.responseMessages.noJsonWebTokenInHeader());
      }

      if (!await JsonWebTokenWorkers.verifiyJsonWebToken(headerToken)) {
        return res.status(409).json(res.locals.responseMessages.jsonWebTokenExpired());
      }

      res.locals.token = await JsonWebTokenWorkers.getDecodedJsonWebToken(headerToken);
      if (!res.locals.token) {
        return res.status(503).json(res.locals.responseMessages.generalError());
      }
      const databaseUsers: User[] = await UsersCollection.find(
        { "_id": new ObjectId(res.locals.token.id) },
        { "jsonToken": 1 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        // send user message and redirect them client side to login screen or whatever.
        return res.status(503).json(res.locals.responseMessages.generalError());
      }
      if (!await JsonWebTokenWorkers.verifiyJsonWebToken(databaseUsers[0].jsonToken)) {
        return res.status(409).json(res.locals.responseMessages.jsonWebTokenExpired());
      }
      const decodedDbToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(databaseUsers[0].jsonToken);
      let matchingTokenAttributes = 0;
      for (const key in decodedDbToken) {
        if (decodedDbToken[key] === res.locals.token[key]) {
          matchingTokenAttributes++;
        }
      }
      if (matchingTokenAttributes < 4) {
        return res.status(409).json(res.locals.responseMessages.jsonWebTokenDoesntMatchStoredToken());
      }
      next();
    } catch (error) {
      // TODO: error handler
      return res.status(503).json(res.locals.responseMessages.generalError());
    }
  }
}
