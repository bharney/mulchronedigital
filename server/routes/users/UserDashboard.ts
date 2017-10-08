import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { JsonWebToken } from "../../security/JsonWebToken";


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
    console.log("hello");
    if (req.headers["user-authenication-token"] === null) {
      res.json(res.locals.responseMessage.noJsonWebTokenInHeader());
      res.end();
    }
    console.log("hello");
    const token = req.headers["user-authenication-token"];
    await JsonWebToken.verifiyJsonWebToken(token);

  }
}
