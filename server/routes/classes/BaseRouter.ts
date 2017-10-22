import { NextFunction, Request, Response } from "express";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { Database } from "../../globals/Database";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";

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
        res.json(res.locals.responseMessages.noJsonWebTokenInHeader());
        res.end();
      }

      if (!await JsonWebTokenWorkers.verifiyJsonWebToken(headerToken)) {
        res.status(409).json(res.locals.responseMessages.jsonWebTokenExpired());
        res.end();
      }

      res.locals.token = await JsonWebTokenWorkers.getDecodedJsonWebToken(headerToken);
      if (!res.locals.token) {
        res.status(503).json(res.locals.responseMessages.generalError());
        res.end();
      }
    } catch (error) {
      // TODO: error handler
      throw error;
    }
    next();
  }
}
