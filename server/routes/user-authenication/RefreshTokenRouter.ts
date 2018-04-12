import { Router, Request, Response, NextFunction } from "express";
import { User } from "../../models/User";
import BaseSubRouter from "../classes/BaseSubRouter";
import { UserAuthenicationDataAccess } from "../../data-access/UserAuthenicationDataAccess";
import { ResponseMessages } from "../../globals/ResponseMessages";

export default class RegisterUserRouter extends BaseSubRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    public configureRouter(): void {
        this.router.use("/", this.checkForUserJsonWebToken);
        this.router.get("/", this.validateRefreshJsonWebToken);
    }

    private async validateRefreshJsonWebToken(req: Request, res: Response, next: NextFunction) {
        try {
          // here we are not going to check to see if the user session expired.
          // what if the user was logged out for like 5 days?
          const token = res.locals.token;
          const databaseUsers: User[] = await UserAuthenicationDataAccess.findUserJsonWebTokenRefreshInformationById(token.id);
          if (databaseUsers.length <= 0) {
            return res.status(401).json(await ResponseMessages.noUserFound());
          }
          return res.status(200).json(await ResponseMessages.successfulUserLogin(databaseUsers[0]));
        } catch (error) {
          res.status(503).json(await ResponseMessages.generalError());
          return next(error);
        }
      }
}