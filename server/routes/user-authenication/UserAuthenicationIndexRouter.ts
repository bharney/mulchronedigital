import { Router } from "express";
import LoginUserRouter from "./LoginUserRouter";
import RegisterUserRouter from "./RegisterUserRouter";
import RefreshTokenRouter from "./RefreshTokenRouter";
import ActivateUserRouter from "./ActivateUserRouter";
import ForgotPasswordRouter from "./ForgotPasswordRouter";
import ResetPasswordRouter from "./ResetPasswordRouter";
import IBaseIndexRouter from "../classes/IBaseIndexRouter";

export default class UserAuthenicationIndexRouter implements IBaseIndexRouter  {
  public router: Router;
  private loginUserRouter: Router;
  private registerUserRouter: Router;
  private refreshTokenRouter: Router;
  private activateUserRouter: Router;
  private forgotPasswordRouter: Router;
  private resetPasswordRouter: Router;

  constructor() {
    this.router = Router();
    this.createSubRouters();
    this.configureRouter();
  }

  public createSubRouters(): void {
      this.loginUserRouter = new LoginUserRouter().router;
      this.registerUserRouter = new RegisterUserRouter().router;
      this.refreshTokenRouter = new RefreshTokenRouter().router;
      this.activateUserRouter = new ActivateUserRouter().router;
      this.forgotPasswordRouter = new ForgotPasswordRouter().router;
      this.resetPasswordRouter = new ResetPasswordRouter().router;
  }

  public configureRouter(): void {
    this.router.use("/loginuser", this.loginUserRouter);
    this.router.use("/registeruser", this.registerUserRouter);
    this.router.use("/refreshtoken", this.refreshTokenRouter);
    this.router.use("/activateuser", this.activateUserRouter);
    this.router.use("/forgotpassword", this.forgotPasswordRouter);
    this.router.use("/resetpassword", this.resetPasswordRouter);
  }
}
