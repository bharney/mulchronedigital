import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { UserAuthenicationDataAccess } from "../../data-access/UserAuthenicationDataAccess";
import { User } from "../../models/User";
import { ForgotPasswordToken } from "../../models/ForgotPasswordToken";
import { HttpHelpers } from "../../globals/HttpHelpers";
import { EmailQueueExport } from "../../config/master";
import { UserActionHelper } from "../../helpers/UserActionHelper";

export default class ForgotPasswordRouter extends BaseRouter {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.configureRouter();
  }

  private configureRouter(): void {
    this.router.use("/", this.decryptRequestBody);
    this.router.patch("/", this.validateUserForgotPassword);
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
}