import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { Router, Request, NextFunction, Response } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import { Database } from "../../globals/Database";
import { User } from "../../models/user";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { UsersCollection } from "../../cluster/master";
import { UserIpAddress } from "../classes/UserIpAddress";
import { HttpHelpers } from "../../globals/HttpHelpers";
import { ObjectId } from "mongodb";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { IJsonWebToken, JsonWebToken } from "../../../shared/interfaces/IJsonWebToken";
import { EmailQueueExport } from "../../cluster/master";


export class UserAuthenicationRouter extends BaseRouter {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.configureRouter();
  }

  private configureRouter(): void {
    // Register user
    this.router.use("/registeruser", this.validateRegisterUserRequest);
    this.router.use("/registeruser", this.doesUsernameOrEmailExistAlready);
    this.router.post("/registeruser", this.insertNewUser);

    // Login User
    this.router.get("/loginuser/:email/:password", this.validateLoginUserRequest);

    // RefreshJsonWebToken
    this.router.get("/refreshtoken", this.validateRefreshJsonWebToken);
  }

  private async validateRegisterUserRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const responseMessages = new ResponseMessages();
      if (!await UserAuthenicationValidator.isUserNameValid(req.body.username)) {
        return res.status(422).json(responseMessages.userNameIsNotValid());
      }

      if (!await UserAuthenicationValidator.isEmailValid(req.body.email)) {
        return res.status(422).json(responseMessages.emailIsNotValid());
      }

      if (!await UserAuthenicationValidator.isPasswordValid(req.body.password)) {
        return res.status(422).json(responseMessages.passwordIsNotValid());
      }
      next();
    } catch (error) {
      // TODO: router error handler
      throw error;
    }
  }

  private async doesUsernameOrEmailExistAlready(req: Request, res: Response, next: NextFunction) {
    try {
      const responseMessages = new ResponseMessages();
      const databaseUser: User[] = await UsersCollection.find(
        { "username": req.body.username }, { "_id": 1 }
      ).toArray();
      if (databaseUser.length > 0) {
        return res.status(409).json(responseMessages.usernameIsTaken(req.body.username));
      }
      const databaseEmail = await UsersCollection.find(
        { "email": req.body.email },
        { "_id": 1 }
      ).toArray();
      if (databaseEmail.length > 0) {
        return res.status(409).json(responseMessages.emailIsTaken(req.body.email));
      }
      next();
    } catch (error) {
      // TODO: router error handler
      throw error;
    }
  }

  private async insertNewUser(req: Request, res: Response) {
    try {
      const responseMessages = new ResponseMessages();
      const httpHelpers = new HttpHelpers();
      const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
      const ipAddressObject = new UserIpAddress(ip);
      const newUser = new User(req.body.username, req.body.email, req.body.password, ipAddressObject);
      // TODO: split this up into seperate functions. little messy;
      if (await newUser.SetupNewUser()) {
        const insertResult = await UsersCollection.insertOne(newUser);
        if (insertResult.result.n === 1) {
          res.status(200).json(responseMessages.userRegistrationSuccessful(req.body.username, req.body.email));
          EmailQueueExport.sendUserActivationEmailToQueue(newUser);
        } else {
          return res.status(503).json(responseMessages.generalError());
        }
      } else {
        return res.status(503).json(responseMessages.generalError());
      }
    } catch (error) {
      // TODO: router error handler
      throw error;
    }
  }

  private async validateLoginUserRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const responseMessages = new ResponseMessages();
      if (!await UserAuthenicationValidator.isEmailValid(req.params.email)) {
        return res.status(401).json(responseMessages.emailIsNotValid());
      }

      if (!await UserAuthenicationValidator.isPasswordValid(req.params.password)) {
        return res.status(401).json(responseMessages.passwordIsNotValid());
      }
      const databaseUsers: User[] = await UsersCollection.find(
        { "email": req.params.email },
        { "_id": 1, "password": 1, "username": 1, "isAdmin": 1, "isActive": 1 }
      ).toArray();
      // should only be one user with this email
      if (databaseUsers.length === 1) {
        if (!databaseUsers[0].isActive) {
          return res.status(401).json(responseMessages.userAccountNotActive(databaseUsers[0].username));
        } else if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(req.params.password, databaseUsers[0].password)) {
          return res.status(401).json(responseMessages.passwordsDoNotMatch());
        } else {
          res.status(200).json(await responseMessages.successfulUserLogin(databaseUsers[0]));
          // TODO: MAKE A FUNCTION!!!!
          const httpHelpers = new HttpHelpers();
          const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
          const ipAddressObject = new UserIpAddress(ip);
          const matchingUserIpAddresses = await UsersCollection.find(
            { "_id": new ObjectId(databaseUsers[0]._id) },
            { "ipAddresses": { $elemMatch: { "ipAddress": ip } } }
          ).toArray();
          if (matchingUserIpAddresses[0].ipAddresses === undefined) {
            // TODO: we are now associating a new or unknown IP address to the user.
            // we probably dont have to await this, but here is where we can pass something out to RabbitMQ... maybe????
            await UsersCollection.findOneAndUpdate(
              { "_id": new ObjectId(databaseUsers[0]._id) },
              { $push: { "ipAddresses": ipAddressObject } },
              { new: true }
            );
          }
        }
      } else {
        return res.status(401).json(responseMessages.noUserFound());
      }
    } catch (error) {
      throw error;
    }
  }

  private async validateRefreshJsonWebToken(req: Request, res: Response, next: NextFunction) {
    const responseMessages = new ResponseMessages();
    try {
      // here we are not going to check to see if the user session expired.
      // what if the user was logged out for like 5 days?
      const token: IJsonWebToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(req.headers["user-authenication-token"]);
      if (token === null) {
        return res.status(401).json(responseMessages.noJsonWebTokenInHeader());
      }
      const databaseUsers: User[] = await UsersCollection.find({ _id: new ObjectId(token.id) }, { _id: 1, username: 1, isAdmin: 1, jsonToken: 1 }).toArray();
      if (databaseUsers.length <= 0) {
        return res.status(401).json(responseMessages.noUserFound());
      }
      const dbToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(databaseUsers[0].jsonToken);
      if (!await JsonWebTokenWorkers.comparedHeaderTokenWithDbToken(token, dbToken)) {
        return res.status(401).json(responseMessages.jsonWebTokenDoesntMatchStoredToken());
      }
      return res.status(200).json(await responseMessages.successfulUserLogin(databaseUsers[0]));
    } catch (error) {
      // TODO: log error with winston
      console.log(error);
      return res.status(503).json(responseMessages.generalError());
    }
  }
}
