import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { Router, Request, NextFunction, Response } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import { Database } from "../../globals/Database";
import { User } from "../../models/user";
import { ResponseMessages } from "../../globals/ResponseMessages";


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
        res.status(422).json(res.locals.responseMessages.usernameIsNotValid());
        res.end();
        return;
      }

      if (!await UserAuthenicationValidator.isEmailValid(req.body.email)) {
        res.status(422).json(res.locals.responseMessages.emailIsNotValid());
        res.end();
        return;
      }

      if (!await UserAuthenicationValidator.isPasswordValid(req.body.password)) {
        res.status(422).json(res.locals.responseMessages.passwordIsNotValid());
        res.end();
        return;
      }
      next();
    } catch (error) {
      // TODO: router error handler
      throw error;
    }
  }

  private async doesUsernameOrEmailExistAlready(req: Request, res: Response, next: NextFunction) {
    try {
      const db = await Database.CreateDatabaseConnection();
      const usersCollection = db.collection("Users");
      const databaseUser: User[] = await usersCollection.find<User>(
        { "username": req.body.username }, { "_id": 1 }
      ).toArray();
      if (databaseUser.length > 0) {
        db.close();
        res.status(409).json(res.locals.responseMessages.usernameIsTaken(req.body.username));
        res.end();
        return;
      }

      const databaseEmail = await usersCollection.find(
        { "email": req.body.email },
        { "_id": 1 }
      ).toArray();
      if (databaseEmail.length > 0) {
        db.close();
        res.status(409).json(res.locals.responseMessages.emailIsTaken(req.body.email));
        res.end();
        return;
      }
      res.locals.db = db;
      next();
    } catch (error) {
      // TODO: router error handler
      throw error;
    }
  }

  private async insertNewUser(req: Request, res: Response) {
    try {
      const newUser = new User(req.body.username, req.body.email, req.body.password);
      // TODO: split this up into seperate functions. little messy;
      if (await newUser.SetupNewUser()) {
        const usersCollection = res.locals.db.collection("Users");
        const insertResult = await usersCollection.insertOne(newUser);
        if (insertResult.result.n === 1) {
          res.locals.db.close();
          res.status(200).json(res.locals.responseMessages.userRegistrationSuccessful(req.body.username));
          res.end();
        } else {
          res.locals.db.close();
          res.status(503).json(res.locals.responseMessages.generalError());
          res.end();
        }
      } else {
        res.locals.db.close();
        res.status(503).json(res.locals.responseMessages.generalError());
        res.end();
      }
    } catch (error) {
      // TODO: router error handler
      throw error;
    }
  }

  private async validateLoginUserRequest(req: Request, res: Response, next: NextFunction) {
    try {
      if (!await UserAuthenicationValidator.isEmailValid(req.params.email)) {
        res.status(401).json(res.locals.responseMessages.emailIsNotValid());
        res.end();
      }

      if (!await UserAuthenicationValidator.isPasswordValid(req.params.password)) {
        res.status(401).json(res.locals.responseMessages.passwordIsNotValid());
        res.end();
      }

      const db = await Database.CreateDatabaseConnection();
      const usersCollection = db.collection("Users");
      const databaseUsers: User[] = await usersCollection.find<User>(
        { "email": req.params.email },
        {"_id": 1, "password": 1, "username": 1, "isAdmin": 1}
      ).toArray();
      // should only be one user with this email
      if (databaseUsers.length === 1) {
        if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(req.params.password, databaseUsers[0].password)) {
          db.close();
          res.status(401).json(res.locals.responseMessages.passwordsDoNotMatch());
          res.end();
        } else {
          db.close();
          res.status(200).json(await res.locals.responseMessages.successfulUserLogin(databaseUsers[0]));
          res.end();
        }
      } else {
        db.close();
        res.json(res.locals.responseMessages.noUserFound());
        res.end();
      }
    } catch (error) {
      throw error;
    }
  }
}
