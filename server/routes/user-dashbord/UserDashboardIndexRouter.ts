import { Router } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import GetUserInformationRouter from "./GetUserInformationRouter";
import ChangePasswordRouter from "./ChangePasswordRouter";
import ChangeUsernameRouter from "./ChangeUsernameRouter";
import ChangeProfileImageRouter from "./ChangeProfileImageRouter";
import UpdateUserLocationRouter from "./UpdateUserLocationRouter";

export class UserDashboardRouterIndex extends BaseRouter {
  public router: Router;
  private getUserInformationRouter: Router;
  private changePasswordRouter: Router;
  private changeUserNameRouter: Router;
  private changeProfileImageRouter: Router;
  private updateUserLocationRouter: Router;

  constructor() {
    super();
    this.router = Router();
    this.createSubRouters();
    this.configureRouter();
  }

  private createSubRouters() {
    this.getUserInformationRouter = new GetUserInformationRouter().router;
    this.changePasswordRouter = new ChangePasswordRouter().router;
    this.changeUserNameRouter = new ChangeUsernameRouter().router;
    this.changeProfileImageRouter = new ChangeProfileImageRouter().router;
    this.updateUserLocationRouter = new UpdateUserLocationRouter().router;
  }

  private configureRouter(): void {
    this.router.use("/getuserinformation", this.getUserInformationRouter);
    this.router.use("/changepassword", this.changePasswordRouter);
    this.router.use("/changeusername", this.changeUserNameRouter);
    this.router.use("/changeprofileimage", this.changeProfileImageRouter);
    this.router.use("/updateuserlocation", this.updateUserLocationRouter);
  }
}
