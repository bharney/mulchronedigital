import { NextFunction, Request, Response } from "express";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { Database } from "../../globals/Database";

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
}
