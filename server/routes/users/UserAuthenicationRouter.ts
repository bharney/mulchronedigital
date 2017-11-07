import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { Router, Request, NextFunction, Response } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import { Database } from "../../globals/Database";
import { User } from "../../models/user";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { UsersCollection } from "../../cluster/master";
import { UserIpAddress } from "../classes/UserIpAddress";
import { HttpHelpers } from "../../globals/HttpHelpers";
import { ObjectId } from 'mongodb';


export class UserAuthenicationRouter extends BaseRouter {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.configureRouter();
  }

  private configureRouter(): void {
    // Register user
    this.router.use("/registeruser", this.createStandardLocalResponseObjects);
    this.router.use("/registeruser", this.validateRegisterUserRequest);
    this.router.use("/registeruser", this.doesUsernameOrEmailExistAlready);
    this.router.post("/registeruser", this.insertNewUser);

    // Login User
    this.router.use("/loginuser/:email/:password", this.createStandardLocalResponseObjects);
    this.router.get("/loginuser/:email/:password", this.validateLoginUserRequest);
  }

  private async validateRegisterUserRequest(req: Request, res: Response, next: NextFunction) {
    try {
      if (!await UserAuthenicationValidator.isUserNameValid(req.body.username)) {
        return res.status(422).json(res.locals.responseMessages.usernameIsNotValid());
      }

      if (!await UserAuthenicationValidator.isEmailValid(req.body.email)) {
        return res.status(422).json(res.locals.responseMessages.emailIsNotValid());
      }

      if (!await UserAuthenicationValidator.isPasswordValid(req.body.password)) {
        return res.status(422).json(res.locals.responseMessages.passwordIsNotValid());
      }
      next();
    } catch (error) {
      // TODO: router error handler
      throw error;
    }
  }

  private async doesUsernameOrEmailExistAlready(req: Request, res: Response, next: NextFunction) {
    try {
      const databaseUser: User[] = await UsersCollection.find(
        { "username": req.body.username }, { "_id": 1 }
      ).toArray();
      if (databaseUser.length > 0) {
        return res.status(409).json(res.locals.responseMessages.usernameIsTaken(req.body.username));
      }
      const databaseEmail = await UsersCollection.find(
        { "email": req.body.email },
        { "_id": 1 }
      ).toArray();
      if (databaseEmail.length > 0) {
        return res.status(409).json(res.locals.responseMessages.emailIsTaken(req.body.email));
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
      const ip = await httpHelpers.getIpAddressFromRequestObject(req);
      const ipAddressObject = new UserIpAddress(ip);
      const newUser = new User(req.body.username, req.body.email, req.body.password, ipAddressObject);
      // TODO: split this up into seperate functions. little messy;
      if (await newUser.SetupNewUser()) {
        const insertResult = await UsersCollection.insertOne(newUser);
        if (insertResult.result.n === 1) {
          return res.status(200).json(res.locals.responseMessages.userRegistrationSuccessful(req.body.username));
          // TODO: send email to have user confirm their registration (can remove the return statement and execute afterwards);
        } else {
          return res.status(503).json(res.locals.responseMessages.generalError());
        }
      } else {
        return res.status(503).json(res.locals.responseMessages.generalError());
      }
    } catch (error) {
      // TODO: router error handler
      throw error;
    }
  }

  private async validateLoginUserRequest(req: Request, res: Response, next: NextFunction) {
    try {
      if (!await UserAuthenicationValidator.isEmailValid(req.params.email)) {
        return res.status(401).json(res.locals.responseMessages.emailIsNotValid());
      }

      if (!await UserAuthenicationValidator.isPasswordValid(req.params.password)) {
        return res.status(401).json(res.locals.responseMessages.passwordIsNotValid());
      }
      const databaseUsers: User[] = await UsersCollection.find(
        { "email": req.params.email },
        { "_id": 1, "password": 1, "username": 1, "isAdmin": 1 }
      ).toArray();
      // should only be one user with this email
      if (databaseUsers.length === 1) {
        if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(req.params.password, databaseUsers[0].password)) {
          return res.status(401).json(res.locals.responseMessages.passwordsDoNotMatch());
        } else {
          res.status(200).json(await res.locals.responseMessages.successfulUserLogin(databaseUsers[0]));
          // TODO: MAKE A FUNCTION!!!!
          const httpHelpers = new HttpHelpers();
          const ip = await httpHelpers.getIpAddressFromRequestObject(req);
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
        return res.status(401).json(res.locals.responseMessages.noUserFound());
      }
    } catch (error) {
      throw error;
    }
  }
}
