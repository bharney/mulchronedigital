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

export default class UserAuthenicationIndexRouter extends BaseRouter {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.configureRouter();
  }

  private configureRouter(): void {
    // Register user
    this.router.use("/registeruser", this.decryptRequestBody);
    this.router.use("/registeruser", this.validateRegisterUserRequest);
    this.router.use("/registeruser", this.doesUsernameOrEmailExistAlready);
    this.router.post("/registeruser", this.insertNewUser);

    // Login User
    this.router.use("/loginuser", this.decryptRequestBody);
    this.router.post("/loginuser", this.validateLoginUserRequest);

    // RefreshJsonWebToken
    this.router.use("/refreshtoken", this.checkForUserJsonWebToken);
    this.router.get("/refreshtoken", this.validateRefreshJsonWebToken);

    this.router.patch("/activateuser", this.validateActivateUser);

    // Forgot password
    this.router.use("/forgotpassword", this.decryptRequestBody);
    this.router.patch("/forgotpassword", this.validateUserForgotPassword);

    // Reset password
    this.router.use("/resetpassword", this.decryptRequestBody);
    this.router.use("/resetpassword", this.validateResetPassword);
  }

  private async validateRegisterUserRequest(req: Request, res: Response, next: NextFunction) {
    try {
      if (!await UserAuthenicationValidator.isUserNameValid(req.body.username)) {
        return res.status(422).json(await ResponseMessages.userNameIsNotValid());
      }
      if (!await UserAuthenicationValidator.isEmailValid(req.body.email)) {
        return res.status(422).json(await ResponseMessages.emailIsNotValid());
      }
      if (!await UserAuthenicationValidator.isPasswordValid(req.body.password)) {
        return res.status(422).json(await ResponseMessages.passwordIsNotValid());
      }
      next();
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
  }

  private async doesUsernameOrEmailExistAlready(req: Request, res: Response, next: NextFunction) {
    try {
      const databaseUser: User[] = await UserAuthenicationDataAccess.findIfUserExistsByUsername(req.body.username);
      if (databaseUser.length > 0) {
        return res.status(409).json(await ResponseMessages.usernameIsTaken(req.body.username));
      }
      const databaseEmail: User[] = await UserAuthenicationDataAccess.findIfUserExistsByEmail(req.body.email);
      if (databaseEmail.length > 0) {
        return res.status(409).json(await ResponseMessages.emailIsTaken(req.body.email));
      }
      next();
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
  }

  private async insertNewUser(req: Request, res: Response, next: NextFunction) {
    try {
      const httpHelpers = new HttpHelpers();
      const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
      const domain = await DnsHelpers.reverseDNSLookup(ip);
      const userAgent = await httpHelpers.getUserAgentFromRequestObject(req.headers);
      const ipAddressObject = new UserIpAddress(ip, userAgent, domain);
      const newUser = new User(req.body.username, req.body.email, req.body.password, ipAddressObject);
      // TODO: split this up into seperate functions. little messy;
      if (await newUser.SetupNewUser()) {
        const insertResult = await UserAuthenicationDataAccess.insertNewUser(newUser);
        if (insertResult.result.n === 1) {
          res.status(200).json(await ResponseMessages.userRegistrationSuccessful(req.body.username, req.body.email));
          EmailQueueExport.sendUserActivationEmailToQueue(newUser);
        } else {
          return res.status(503).json(await ResponseMessages.generalError());
        }
      } else {
        return res.status(503).json(await ResponseMessages.generalError());
      }
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
  }

  private async validateLoginUserRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.body.email;
      const userPassword = req.body.password;
      if (!await UserAuthenicationValidator.isEmailValid(userEmail)) {
        return res.status(401).json(await ResponseMessages.emailIsNotValid());
      }
      if (!await UserAuthenicationValidator.isPasswordValid(userPassword)) {
        return res.status(401).json(await ResponseMessages.passwordIsNotValid());
      }
      const databaseUsers: User[] = await DataAccess.findUserLoginDetailsByEmail(userEmail);
      // should only be one user with this email
      if (databaseUsers.length === 1) {
        if (!databaseUsers[0].isActive) {
          return res.status(401).json(await ResponseMessages.userAccountNotActive(databaseUsers[0].username));
        } else if (!await ServerEncryption.comparedStoredHashPasswordWithLoginPassword(userPassword, databaseUsers[0].password)) {
          return res.status(401).json(await ResponseMessages.passwordsDoNotMatch());
        } else {
          res.status(200).json(await ResponseMessages.successfulUserLogin(databaseUsers[0]));
          // TODO: MAKE A FUNCTION!!!!
          const httpHelpers = new HttpHelpers();
          const userId = databaseUsers[0]._id;
          const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
          const domain = await DnsHelpers.reverseDNSLookup(ip);
          const userAgent = await httpHelpers.getUserAgentFromRequestObject(req.headers);
          const ipAddressObject = new UserIpAddress(ip, userAgent, domain);
          const matchingUserIpAddresses = await UserAuthenicationDataAccess.findMatchingIpAddressbyUserId(userId, ip);
          if (matchingUserIpAddresses[0].ipAddresses === undefined) {
            // TODO: we are now associating a new or unknown IP address to the user.
            // we probably dont have to await this, but here is where we can pass something out to RabbitMQ... maybe????
            await UserAuthenicationDataAccess.updateUserProfileIpAddresses(userId, ipAddressObject);
          }
          const userActions = new UserActionHelper();
          await userActions.userLoggedIn(userId, ip);
        }
      } else {
        return res.status(401).json(await ResponseMessages.noUserFound());
      }
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
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

  private async validateActivateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.id;
      if (!UserAuthenicationValidator.isThisAValidMongoObjectId(userId)) {
        // TODO: create some kind of message.
        return res.status(401).json(await ResponseMessages.generalError());
      }
      const updatedProfile = await UserAuthenicationDataAccess.updateUserProfileIsActive(userId);
      if (updatedProfile.lastErrorObject.updatedExisting && updatedProfile.lastErrorObject.n === 1) {
        return res.status(200).json(await ResponseMessages.userAccountActiveSuccess());
      }
      return res.status(401).json(await ResponseMessages.generalError());
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
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
