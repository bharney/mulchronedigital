import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { UserDashboardDataAccess } from "../../data-access/UserDashboardDataAccess";
import { User } from "../../models/User";
import { ServerEncryption } from "../../security/ServerEncryption";
import { UserActionHelper } from "../../helpers/UserActionHelper";
import { HttpHelpers } from "../../globals/HttpHelpers";

export default class ChangeUsernameRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        // change username
    this.router.use("/", this.checkForUserJsonWebToken);
    this.router.use("/", this.decryptRequestBody);
    this.router.patch("/", this.validateUserChangeUsername);
    }

    private async validateUserChangeUsername(req: Request, res: Response, next: NextFunction) {
        try {
          const newUsername = req.body.newUsername;
          const password = req.body.password;
          const userId = res.locals.token.id;
          if (!await UserAuthenicationValidator.isUserNameValid(newUsername)) {
            return res.status(422).json(await ResponseMessages.userNameIsNotValid());
          }
          if (!await UserAuthenicationValidator.isPasswordValid(password)) {
            return res.status(422).json(await ResponseMessages.passwordIsNotValid());
          }
          const existingUsers: User[] = await UserDashboardDataAccess.findIfUserExistsByUsername(newUsername);
          if (existingUsers.length > 0) {
            return res.status(409).json(await ResponseMessages.usernameIsTaken(newUsername));
          }
          const databaseUsers: User[] = await UserDashboardDataAccess.findUserPasswordAndUsernameById(userId);
          if (databaseUsers.length <= 0) {
            return res.status(422).json(await ResponseMessages.noUserFound());
          }
          if (!await ServerEncryption.comparedStoredHashPasswordWithLoginPassword(password, databaseUsers[0].password)) {
            return res.status(401).json(await ResponseMessages.passwordsDoNotMatch());
          }
          const oldUsername = databaseUsers[0].username;
          const user = new User(req.body.newUsername);
          const updateResult = await UserDashboardDataAccess.modifiyUsernameByUserId(userId, user);
          if (updateResult.modifiedCount === 1) {
            res.status(200).json(await ResponseMessages.usernameChangeSuccessful(user.username));
            const httpHelpers = new HttpHelpers();
            const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
            const actionHelpers = new UserActionHelper();
            await actionHelpers.userChangedUsername(userId, ip, oldUsername);
          } else {
            throw new Error("Nothing was modified");
          }
        } catch (error) {
          res.status(503).json(await ResponseMessages.generalError());
          return next(error);
        }
      }
}
