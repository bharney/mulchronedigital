import { User } from "../../models/user";
import { Database } from "../../globals/Database";
import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { JsonWebToken } from "../../../shared/interfaces/IJsonWebToken";
import { ObjectId } from "mongodb";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";


export class UserDashboardRouter extends BaseRouter {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.configureRouter();
  }

  private configureRouter(): void {
    // Register user
    this.router.use("/getuserinformation", this.createStandardLocalResponseObjects);
    this.router.use("/getuserinformation", this.checkForUserJsonWebToken);
    this.router.get("/getuserinformation", this.validateUserCredentials);

    // change user password
    this.router.use("/changepassword", this.createStandardLocalResponseObjects);
    this.router.use("/changepassword", this.checkForUserJsonWebToken);
    this.router.patch("/changepassword", this.validateUserChangePassword);

    // change username
    this.router.use("/changeusername", this.createStandardLocalResponseObjects);
    this.router.use("/changeusername", this.checkForUserJsonWebToken);
    this.router.patch("/changeusername", this.validateUserChangeUsername);
  }

  private async validateUserCredentials(req: Request, res: Response) {
    try {
      const db = await Database.CreateDatabaseConnection();
      const usersCollection = db.collection("Users");
      // TODO: why does this have to be to return as an array?
      // return only the username for the time being, omit the userid
      const databaseUsers: User[] = await usersCollection.find<User>(
        { "_id": new ObjectId(res.locals.token.id) },
        { "username": 1, "_id": 0 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        res.status(503).json(res.locals.responseMessages.generalError());
        res.end();
        return;
      }

      db.close();
      // we are looking by object id there should only user in this array.
      res.status(200).json(res.locals.responseMessages.dashboardUserFound(databaseUsers[0]));
      res.end();
      return;
    } catch (error) {
      // TOOD: log error?
      res.status(503).json(res.locals.responseMessages.generalError());
      res.end();
      return;
    }
  }

  private async validateUserChangePassword(req: Request, res: Response) {
    try {
      if (!await UserAuthenicationValidator.isPasswordValid(req.body.currentPassword) || !await UserAuthenicationValidator.isPasswordValid(req.body.newPassword)) {
        res.status(422).json(res.locals.responseMessages.passwordIsNotValid());
        res.end();
        return;
      }

      // TODO: abstract this chunk of code, it is going to be come extremely redundant.
      const db = await Database.CreateDatabaseConnection();
      const usersCollection = db.collection("Users");
      const databaseUsers: User[] = await usersCollection.find<User>(
        { "_id": new ObjectId(res.locals.token.id) },
        { "password": 1, "_id": 1 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        db.close();
        res.status(422).json(res.locals.responseMessages.noUserFound());
        res.end();
        return;
      }

      if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(req.body.currentPassword, databaseUsers[0].password)) {
        db.close();
        res.status(401).json(res.locals.responseMessages.passwordsDoNotMatch());
        res.end();
        return;
      }
      const user = new User(databaseUsers[0].username, databaseUsers[0].email, req.body.newPassword);
      if (!await user.updateUserPassword()) {
        db.close();
        res.status(503).json(res.locals.responseMessages.generalError());
        res.end();
        return;
      }

      const updateResult = await usersCollection.updateOne(
        { "_id": new ObjectId(databaseUsers[0]._id) },
        { $set: { "password": user.password, "modifiedAt": user.modifiedAt } }
      );

      db.close();
      if (updateResult.modifiedCount === 1) {
        res.status(200).json(res.locals.responseMessages.userChangedPasswordSuccessfully());
        res.send();
        return;
      } else {
        throw new Error("There was nothing updated");
      }

    } catch (error) {
      console.log(error);
      // TOOD: log error?
      res.status(503).json(res.locals.responseMessages.generalError());
      res.end();
      return;
    }
  }

  private async validateUserChangeUsername(req: Request, res: Response) {
    try {
      if (!await UserAuthenicationValidator.isUserNameValid(req.body.newUsername)) {
        res.status(422).json(res.locals.responseMessages.usernameIsNotValid());
        res.end();
        return;
      }
      if (!await UserAuthenicationValidator.isPasswordValid(req.body.password)) {
        res.status(422).json(res.locals.responseMessages.passwordIsNotValid());
        res.end();
        return;
      }
      // TODO: abstract this chunk of code, it is going to be come extremely redundant.
      const db = await Database.CreateDatabaseConnection();
      const usersCollection = db.collection("Users");
      const existingUsers: User[] = await usersCollection.find<User>(
        { "username": req.body.newUsername }, { "_id": 1 }
      ).toArray();
      if (existingUsers.length > 0) {
        db.close();
        res.status(409).json(res.locals.responseMessages.usernameIsTaken(req.body.newUsername));
        res.end();
        return;
      }
      const databaseUsers: User[] = await usersCollection.find<User>(
        { "_id": new ObjectId(res.locals.token.id) },
        { "password": 1, "_id": 1 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        db.close();
        res.status(422).json(res.locals.responseMessages.noUserFound());
        res.end();
        return;
      }
      if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(req.body.password, databaseUsers[0].password)) {
        db.close();
        res.status(401).json(res.locals.responseMessages.passwordsDoNotMatch());
        res.end();
        return;
      }
      const user = new User(req.body.newUsername);
      const updateResult = await usersCollection.updateOne(
        { "_id": new ObjectId(databaseUsers[0]._id) },
        { $set: { "username": user.username, "modifiedAt": user.modifiedAt } }
      );
      db.close();
      if (updateResult.modifiedCount === 1) {
        res.status(200).json(res.locals.responseMessages.usernameChangeSuccessful(user.username));
        res.end();
        return;
      } else {
        throw new Error("Nothing was modified");
      }
    } catch (error) {
      console.log(error);
      res.status(503).json(res.locals.responseMessages.generalError());
      res.end();
    }
  }
}
