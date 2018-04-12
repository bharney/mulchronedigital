import { Router } from "express";
import GetUserInformationRouter from "./GetUserInformationRouter";
import ChangePasswordRouter from "./ChangePasswordRouter";
import ChangeUsernameRouter from "./ChangeUsernameRouter";
import ChangeProfileImageRouter from "./ChangeProfileImageRouter";
import UpdateUserLocationRouter from "./UpdateUserLocationRouter";
import IBaseIndexRouter from "../classes/IBaseIndexRouter";

export default class UserDashboardRouterIndex implements IBaseIndexRouter {
  public router: Router;
  private getUserInformationRouter: Router;
  private changePasswordRouter: Router;
  private changeUserNameRouter: Router;
  private changeProfileImageRouter: Router;
  private updateUserLocationRouter: Router;

  constructor() {
    this.router = Router();
    this.createSubRouters();
    this.configureRouter();
  }

  public createSubRouters(): void {
    this.getUserInformationRouter = new GetUserInformationRouter().router;
    this.changePasswordRouter = new ChangePasswordRouter().router;
    this.changeUserNameRouter = new ChangeUsernameRouter().router;
    this.changeProfileImageRouter = new ChangeProfileImageRouter().router;
    this.updateUserLocationRouter = new UpdateUserLocationRouter().router;
  }

  public configureRouter(): void {
    this.router.use("/getuserinformation", this.getUserInformationRouter);
    this.router.use("/changepassword", this.changePasswordRouter);
    this.router.use("/changeusername", this.changeUserNameRouter);
    this.router.use("/changeprofileimage", this.changeProfileImageRouter);
    this.router.use("/updateuserlocation", this.updateUserLocationRouter);
  }
}
