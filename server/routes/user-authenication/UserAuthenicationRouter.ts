import { Router, Request, NextFunction, Response } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import { UserAuthenicationValidation } from "../classes/UserAuthenicationValidation";
import { Database } from "../../globals/Database";
import { User } from "../../models/user";


export class UserAuthenicationRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.use("/registeruser", this.createStandardLocalResponseObjects);
        this.router.use("/registeruser", this.validateRegisterUserRequest);
        this.router.use("/registeruser", this.doesUsernameOrEmailExistAlready);
        this.router.post("/registeruser", this.insertNewUser);
    }

    private async validateRegisterUserRequest(req: Request, res: Response, next: NextFunction) {
        try {
            if (!await UserAuthenicationValidation.isUserNameValid(req.body.username)) {
                res.json({"status": false, "message": res.locals.responseMessages.usernameIsNotValid()});
                res.end();
                return;
            }

            if (!await UserAuthenicationValidation.isEmailValid(req.body.email)) {
                res.json({"status": false, "message": res.locals.responseMessages.emailIsNotValid()});
                res.end();
                return;
            }

            if (!await UserAuthenicationValidation.isPasswordValid(req.body.password)) {
                res.json({"status": false, "message": res.locals.responseMessages.passwordIsNotValid()});
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
          const db  = await Database.CreateDatabaseConnection();
          const usersCollection = db.collection("Users");
          const databaseUser = await usersCollection.findOne({"username": req.body.username});
          if (databaseUser) {
            db.close();
            res.json({"status": false, "message": res.locals.responseMessages.usernameIsTaken(req.body.username)});
            res.end();
            return;
          }

          const databaseEmail = await usersCollection.findOne({"email": req.body.email});
          if (databaseEmail) {
            db.close();
            res.json({"status": false, "message": res.locals.responseMessages.emailIsTaken(req.body.email)});
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
        const wasUserSetupSuccessful = await newUser.SetupNewUser();
        // TODO: split this up into seperate functions. little messy;
        if (wasUserSetupSuccessful) {
          const usersCollection = res.locals.db.collection("Users");
          const insertResult = await usersCollection.insertOne(newUser);
          if (insertResult.result.n === 1) {
            res.locals.db.close();
            res.json({"status": true, "message": res.locals.responseMessage.userRegistrationSuccessful(req.body.username)});
            res.end();
          } else {
            res.locals.db.close();
            res.json({"status": false, "message": res.locals.responseMessage.dbError()});
            res.end();
          }
        } else {
          res.locals.db.close();
          res.json({"status": false, "message": res.locals.responseMessage.dbError()});
          res.end();
        }
      } catch (error) {
        // TODO: router error handler
        throw error;
      }
    }
}
