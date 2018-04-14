import BaseSubRouter from "../classes/BaseSubRouter";
import { Router, Request, Response, NextFunction } from "express";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { UserAuthenicationDataAccess } from "../../data-access/UserAuthenicationDataAccess";
import { ForgotPasswordToken } from "../../models/ForgotPasswordToken";
import { HttpHelpers } from "../../globals/HttpHelpers";
import { ServerEncryption } from "../../security/ServerEncryption";
import { User } from "../../models/User";
import { DataAccess } from "../../data-access/classes/DataAccess";
import { UserActionHelper } from "../../helpers/UserActionHelper";
import { UserChangedPasswordAction } from "../../models/UserAction";

export default class ResetPasswordRouter extends BaseSubRouter {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.configureRouter();
  }

  public configureRouter(): void {
    this.router.use("/", this.decryptRequestBody);
    this.router.use("/", this.validateResetPassword);
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
      const thirtyDayOldPasswords: UserChangedPasswordAction[] = await DataAccess.findUserPasswordsFromThirtyDaysAgo(resetTokens[0].userId);
      if (await ServerEncryption.wasNewPasswordWasntUsedInLastThirtyDays(thirtyDayOldPasswords, req.body.newPassword)) {
        return res.status(401).json(await ResponseMessages.thisPasswordWasAlreadyUsedInTheLastThirtyDays());
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