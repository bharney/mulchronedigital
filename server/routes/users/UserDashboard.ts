import { BaseRouter } from "../classes/BaseRouter";
import {Router, Request, Response, NextFunction} from "express";


export class UserDashboardRouter extends BaseRouter {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.configureRouter();
  }

  private configureRouter(): void {
    // Register user
    this.router.use("/getuserinformation", this.createStandardLocalResponseObjects);
    this.router.get("/getuserinformation", this.validateUserCredentials);
  }

  private async validateUserCredentials(req: Request, res: Response, next: NextFunction) {
    if (req.headers["User-Authenication-Token"] === null) {
      res.json(res.locals.responseMessage.noJsonWebTokenInHeader());
      res.end();
    }
    const token = req.headers["user-authenication-token"];
    if (!await j)

  }
}
