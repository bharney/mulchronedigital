import { User } from "../../models/user";
import { Database } from "../../globals/Database";
import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { JsonWebToken } from "../../../shared/interfaces/IJsonWebToken";
import { ObjectId } from "mongodb";


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
    this.router.get("/getuserinformation", this.validateUserCredentials);
  }

  private async validateUserCredentials(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers["user-authenication-token"] === null) {
        res.json(res.locals.responseMessages.noJsonWebTokenInHeader());
        res.end();
      }
      const token = req.headers["user-authenication-token"];
      if (!await JsonWebTokenWorkers.verifiyJsonWebToken(token)) {
        res.status(409).json(res.locals.responseMessages.jsonWebTokenExpired());
        res.end();
      }
      const decodedToken: JsonWebToken = await JsonWebTokenWorkers.getDecodedJsonWebToken(token);
      if (!decodedToken) {
        res.status(503).json(res.locals.responseMessages.generalError());
        res.end();
      }
      const db = await Database.CreateDatabaseConnection();
      const usersCollection = db.collection("Users");
      // TODO: why does this have to be to return as an array?
      // return only the username for the time being, omit the userid
      const databaseUsers: User[] = await usersCollection.find<User>(
        { "_id": new ObjectId(decodedToken.id) },
        { "username": 1, "_id": 0 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        res.status(503).json(res.locals.responseMessages.generalError());
        res.end();
      }

      // we are looking by object id there should only user in this array.
      res.status(200).json(res.locals.responseMessages.dashboardUserFound(databaseUsers[0]));
      res.end();
    } catch (error) {
      // TOOD: log error?
      res.status(503).json(res.locals.responseMessages.generalError());
      res.end();
    }
  }
}
