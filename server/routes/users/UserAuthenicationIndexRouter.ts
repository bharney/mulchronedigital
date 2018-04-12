import { UserActionHelper } from "../../helpers/UserActionHelper";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { Router, Request, NextFunction, Response } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import { Database } from "../../globals/Database";
import { User } from "../../models/User";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { UserIpAddress } from "../classes/UserIpAddress";
import { HttpHelpers } from "../../globals/HttpHelpers";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { JsonWebToken } from "../../../shared/JsonWebToken";
import { EmailQueueExport, UsersCollection } from "../../config/master";
import { UserAuthenicationDataAccess } from "../../data-access/UserAuthenicationDataAccess";
import { ForgotPasswordToken } from "../../models/ForgotPasswordToken";
import { Encryption } from "../../../shared/Encryption";
import { DataAccess } from "../../data-access/classes/DataAccess";
import { ServerEncryption } from "../../security/ServerEncryption";
import { DnsHelpers } from "../../globals/DnsHelpers";
import LoginUserRouter from "./LoginUserRouter";
import RegisterUserRouter from "./RegisterUserRouter";
import RefreshTokenRouter from "./RefreshTokenRouter";
import ActivateUserRouter from "./ActivateUserRouter";

export default class UserAuthenicationIndexRouter extends BaseRouter {
  public router: Router;
  private loginUserRouter: Router;
  private registerUserRouter: Router;
  private refreshTokenRouter: Router;
  private activateUserRouter: Router;
  private forgotPasswordRouter: Router;
  private resetPasswordRouter: Router;

  constructor() {
    super();
    this.router = Router();
    this.createSubRouters();
    this.configureRouter();
  }

  private createSubRouters(): void {
      this.loginUserRouter = new LoginUserRouter().router;
      this.registerUserRouter = new RegisterUserRouter().router;
      this.refreshTokenRouter = new RefreshTokenRouter().router;
      this.activateUserRouter = new ActivateUserRouter().router;
  }

  private configureRouter(): void {
    this.router.use("/loginuser", this.loginUserRouter);
    this.router.use("/registeruser", this.registerUserRouter);
    this.router.use("/refreshtoken", this.refreshTokenRouter);
    this.router.use("/activateuser", this.activateUserRouter);


    // Forgot password
    this.router.use("/forgotpassword", this.decryptRequestBody);
    this.router.patch("/forgotpassword", this.validateUserForgotPassword);

    // Reset password
    this.router.use("/resetpassword", this.decryptRequestBody);
    this.router.use("/resetpassword", this.validateResetPassword);
  }

  private async validateUserForgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.body.email;
      if (!await UserAuthenicationValidator.isEmailValid(userEmail)) {
        return res.status(422).json(await ResponseMessages.emailIsNotValid());
      }
      const databaseUsers: User[] = await UserAuthenicationDataAccess.userForgotPasswordFindUserByEmail(userEmail);
      if (databaseUsers.length < 0) {
        return res.status(401).json(await ResponseMessages.noUserFoundThatIsActive());
      }
      const userId = databaseUsers[0]._id;
      const resetPasswordTokens: ForgotPasswordToken[] = await UserAuthenicationDataAccess.findRecentForgotPasswordTokensByUserId(userId);
      if (resetPasswordTokens.length > 0) {
        return res.status(429).json(await ResponseMessages.tooManyForgotPasswordRequests());
      }
      const httpHelpers = new HttpHelpers();
      const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
      const forgotPasswordToken = new ForgotPasswordToken(userId, ip);
      const randomPassword = Math.random().toString(36).slice(-12);
      if (!await forgotPasswordToken.securePassword(randomPassword)) {
        return res.status(503).json(await ResponseMessages.generalError());
      }
      const tokenId = await UserAuthenicationDataAccess.insertForgotPasswordToken(forgotPasswordToken);
      if (tokenId.length === 0) {
        return res.status(503).json(await ResponseMessages.generalError());
      }
      if (!await EmailQueueExport.sendUserForgotPasswordToQueue(userEmail, databaseUsers[0]._id, tokenId, randomPassword)) {
        return res.status(503).json(await ResponseMessages.generalError());
      }
      res.status(200).json(await ResponseMessages.forgotPasswordSuccess(userEmail));
      const userActions = new UserActionHelper();
      await userActions.userForgotPassword(userId, ip, tokenId);
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
  }

  private async validateResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenId = req.body.tokenId;
      const tokenPassword = req.body.tokenPassword;
      const newPassword = req.body.newPassword;
      if (!await UserAuthenicationValidator.isThisAValidMongoObjectId(tokenId)) {
        return res.status(422).json(await ResponseMessages.resetPasswordTokenNotValid());
      }
      if (!await UserAuthenicationValidator.isTokenPasswordValid(tokenPassword)) {
        return res.status(422).json(await ResponseMessages.tokenPasswordNotValid());
      }
      if (!await UserAuthenicationValidator.isPasswordValid(newPassword)) {
        return res.status(422).json(await ResponseMessages.passwordIsNotValid());
      }
      const resetTokens: ForgotPasswordToken[] = await UserAuthenicationDataAccess.findForgotPasswordTokensByTokenId(tokenId);
      if (resetTokens.length <= 0) {
        return res.status(503).json(await ResponseMessages.resetPasswordTokenNotValid());
      }
      const httpHelpers = new HttpHelpers();
      const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
      if (resetTokens[0].ip !== ip) {
        // TODO: log non matching IP addresses somewhere???
        return res.status(401).json(await ResponseMessages.resetPasswordTokenIpAddressDoNotMatch());
      }
      if (!await ServerEncryption.comparedStoredHashPasswordWithLoginPassword(tokenPassword, resetTokens[0].tokenPassword)) {
        return res.status(401).json(await ResponseMessages.tokenPasswordNotValid());
      }
      const userId = resetTokens[0].userId;
      const databaseUsers: User[] = await DataAccess.getUserPassword(userId);
      // dont really need to enter information into the instance of this class.
      const user: User = new User(null, null, newPassword);
      const updateUserPasswordResult = await DataAccess.updateUserPassword(userId, user);
      if (updateUserPasswordResult.modifiedCount === 1) {
        res.status(200).json(await ResponseMessages.userChangedPasswordSuccessfully());
        // no need to await these do not depend on the response to the user.
        UserAuthenicationDataAccess.updatePasswordTokenToInvalidById(tokenId);
        const userActions = new UserActionHelper();
        const userOldPassword = databaseUsers[0].password;
        userActions.userChangedPassword(userId, ip, userOldPassword);
      } else {
        throw new Error("There was nothing updated when attemtping to update the users password");
      }
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
  }
}
