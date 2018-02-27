import { UserActionHelper } from "../../helpers/UserActionHelper";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { Router, Request, NextFunction, Response } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import { Database } from "../../globals/Database";
import { User } from "../../models/user";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { UserIpAddress } from "../classes/UserIpAddress";
import { HttpHelpers } from "../../globals/HttpHelpers";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { JsonWebToken } from "../../../shared/JsonWebToken";
import { EmailQueueExport } from "../../master";
import { UserAuthenicationDataAccess } from "../../data-access/UserAuthenicationDataAccess";
import { ForgotPasswordToken } from "../../models/ForgotPasswordToken";
import { Encryption } from "../../../shared/Encryption";
import { UserDashboardDataAccess } from "../../data-access/UserDashboardDataAccess";

export class UserAuthenicationRouter extends BaseRouter {
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
    this.router.get("/refreshtoken", this.validateRefreshJsonWebToken);

    this.router.patch("/activateuser", this.validateActivateUser);
    // Forgot password
    this.router.patch("/forgotpassword", this.validateUserForgotPassword);
  }

  private async validateRegisterUserRequest(req: Request, res: Response, next: NextFunction) {
    try {
      if (!await UserAuthenicationValidator.isUserNameValid(req.body.username)) {
        return res.status(422).json(ResponseMessages.userNameIsNotValid());
      }
      if (!await UserAuthenicationValidator.isEmailValid(req.body.email)) {
        return res.status(422).json(ResponseMessages.emailIsNotValid());
      }
      if (!await UserAuthenicationValidator.isPasswordValid(req.body.password)) {
        return res.status(422).json(ResponseMessages.passwordIsNotValid());
      }
      next();
    } catch (error) {
      // TODO: router error handler
      throw error;
    }
  }

  private async doesUsernameOrEmailExistAlready(req: Request, res: Response, next: NextFunction) {
    try {
      const databaseUser: User[] = await UserAuthenicationDataAccess.findIfUserExistsByUsername(req.body.username);
      if (databaseUser.length > 0) {
        return res.status(409).json(ResponseMessages.usernameIsTaken(req.body.username));
      }
      const databaseEmail: User[] = await UserAuthenicationDataAccess.findIfUserExistsByEmail(req.body.email);
      if (databaseEmail.length > 0) {
        return res.status(409).json(ResponseMessages.emailIsTaken(req.body.email));
      }
      next();
    } catch (error) {
      // TODO: router error handler
      throw error;
    }
  }

  private async insertNewUser(req: Request, res: Response) {
    try {
      const httpHelpers = new HttpHelpers();
      const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
      const ipAddressObject = new UserIpAddress(ip);
      const newUser = new User(req.body.username, req.body.email, req.body.password, ipAddressObject);
      // TODO: split this up into seperate functions. little messy;
      if (await newUser.SetupNewUser()) {
        const insertResult = await UserAuthenicationDataAccess.insertNewUser(newUser);
        if (insertResult.result.n === 1) {
          res.status(200).json(ResponseMessages.userRegistrationSuccessful(req.body.username, req.body.email));
          EmailQueueExport.sendUserActivationEmailToQueue(newUser);
        } else {
          return res.status(503).json(ResponseMessages.generalError());
        }
      } else {
        return res.status(503).json(ResponseMessages.generalError());
      }
    } catch (error) {
      // TODO: router error handler
      throw error;
    }
  }

  private async validateLoginUserRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.body.email;
      const userPassword = req.body.password;
      if (!await UserAuthenicationValidator.isEmailValid(userEmail)) {
        return res.status(401).json(ResponseMessages.emailIsNotValid());
      }
      if (!await UserAuthenicationValidator.isPasswordValid(userPassword)) {
        return res.status(401).json(ResponseMessages.passwordIsNotValid());
      }
      const databaseUsers: User[] = await UserDashboardDataAccess.findUserLoginDetailsByEmail(userEmail);
      // should only be one user with this email
      if (databaseUsers.length === 1) {
        if (!databaseUsers[0].isActive) {
          return res.status(401).json(ResponseMessages.userAccountNotActive(databaseUsers[0].username));
        } else if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(userPassword, databaseUsers[0].password)) {
          return res.status(401).json(ResponseMessages.passwordsDoNotMatch());
        } else {
          res.status(200).json(await ResponseMessages.successfulUserLogin(databaseUsers[0]));
          // TODO: MAKE A FUNCTION!!!!
          const httpHelpers = new HttpHelpers();
          const userId = databaseUsers[0]._id;
          const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
          const ipAddressObject = new UserIpAddress(ip);
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
        return res.status(401).json(ResponseMessages.noUserFound());
      }
    } catch (error) {
      throw error;
    }
  }

  private async validateRefreshJsonWebToken(req: Request, res: Response, next: NextFunction) {
    try {
      // here we are not going to check to see if the user session expired.
      // what if the user was logged out for like 5 days?
      const token: JsonWebToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(req.headers["user-authenication-token"]);
      if (token === null) {
        return res.status(401).json(ResponseMessages.noJsonWebTokenInHeader());
      }
      const databaseUsers: User[] = await UserAuthenicationDataAccess.findUserJsonWebTokenRefreshInformationById(token.id);
      if (databaseUsers.length <= 0) {
        return res.status(401).json(ResponseMessages.noUserFound());
      }
      const dbToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(databaseUsers[0].jsonToken);
      if (!await JsonWebTokenWorkers.comparedHeaderTokenWithDbToken(token, dbToken)) {
        return res.status(401).json(ResponseMessages.jsonWebTokenDoesntMatchStoredToken());
      }
      return res.status(200).json(await ResponseMessages.successfulUserLogin(databaseUsers[0]));
    } catch (error) {
      // TODO: log error with winston
      console.log(error);
      return res.status(503).json(ResponseMessages.generalError());
    }
  }

  private async validateActivateUser(req: Request, res: Response) {
    try {
      const userId = req.body.id;
      if (!UserAuthenicationValidator.isThisAValidMongoObjectId(userId)) {
        // TODO: create some kind of message.
        return res.status(401).json(ResponseMessages.generalError());
      }
      const updatedProfile = await UserAuthenicationDataAccess.updateUserProfileIsActive(userId);
      if (updatedProfile.lastErrorObject.updatedExisting && updatedProfile.lastErrorObject.n === 1) {
        return res.status(200).json(ResponseMessages.userAccountActiveSuccess());
      }
      return res.status(401).json(ResponseMessages.generalError());
    } catch (error) {
      // TODO: log error with winston
      console.log(error);
      return res.status(503).json(ResponseMessages.generalError());
    }
  }

  private async validateUserForgotPassword(req: Request, res: Response) {
    try {
      if (!await UserAuthenicationValidator.isEmailValid(req.body.email)) {
        return res.status(422).json(ResponseMessages.emailIsNotValid());
      }
      const databaseUsers: User[] = await UserAuthenicationDataAccess.userForgotPasswordFindUserByEmail(req.body.email);
      if (databaseUsers.length <= 0) {
        return res.status(401).json(ResponseMessages.noUserFoundThatIsActive());
      }
      const userId = databaseUsers[0]._id;
      const resetPasswordTokens: ForgotPasswordToken[] = await UserAuthenicationDataAccess.checkForRecentForgotPasswordTokens(userId);
      if (resetPasswordTokens.length > 0) {
        return res.status(429).json(ResponseMessages.tooManyForgotPasswordRequests());
      }
      const forgotPasswordToken = new ForgotPasswordToken(userId);
      const newPassword = Math.random().toString(36).slice(-12);
      await forgotPasswordToken.securePassword(newPassword);
      const tokenId = await UserAuthenicationDataAccess.insertForgotPasswordToken(forgotPasswordToken);
      if (tokenId.length === 0) {
        return res.status(503).json(ResponseMessages.generalError());
      }
      if (!await EmailQueueExport.sendUserForgotPasswordToQueue(req.body.email, databaseUsers[0]._id, tokenId, newPassword)) {
        return res.status(503).json(ResponseMessages.generalError());
      }
      res.status(200).json(ResponseMessages.forgotPasswordSuccess(req.body.email));
      const httpHelpers = new HttpHelpers();
      const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
      const userActions = new UserActionHelper();
      await userActions.userForgotPassword(userId, ip, tokenId);
    } catch (error) {
      console.log(error);
      return res.status(503).json(ResponseMessages.generalError());
    }
  }
}
