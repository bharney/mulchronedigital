import { NextFunction, Request, Response } from "express";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { Database } from "../../globals/Database";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { UsersCollection } from "../../cluster/master";
import { ObjectId } from "mongodb";
import { JsonWebToken } from "../../../shared/interfaces/IJsonWebToken";
import { User } from "../../models/user";

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
      const databaseUsers: User[] = await UsersCollection.find(
        { "_id": new ObjectId(res.locals.token.id) },
        { "jsonToken": 1 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        // send user message and redirect them client side to login screen or whatever.
        const responseMessages = new ResponseMessages();
        return res.status(503).json(responseMessages.generalError());
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
      return res.status(503).json(responseMessages.generalError());
    }
  }
}
