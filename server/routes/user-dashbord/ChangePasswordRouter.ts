import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { UserDashboardDataAccess } from "../../data-access/UserDashboardDataAccess";
import { ServerEncryption } from "../../security/ServerEncryption";
import { User } from "../../models/User";
import { HttpHelpers } from "../../globals/HttpHelpers";
import { UserActionHelper } from "../../helpers/UserActionHelper";

export default class ChangePasswordRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter() {
        this.router.use("/", this.checkForUserJsonWebToken);
        this.router.use("/", this.decryptRequestBody);
        this.router.patch("/", this.validateUserChangePassword);
    }

    private async validateUserChangePassword(req: Request, res: Response, next: NextFunction) {
        try {
            if (!await UserAuthenicationValidator.isPasswordValid(req.body.currentPassword) || !await UserAuthenicationValidator.isPasswordValid(req.body.newPassword)) {
                return res.status(422).json(await ResponseMessages.passwordIsNotValid());
            }
            // TODO: abstract this chunk of code, it is going to be come extremely redundant.
            const databaseUsers: User[] = await UserDashboardDataAccess.getUserPassword(res.locals.token.id);
            if (databaseUsers.length <= 0) {
                return res.status(422).json(await ResponseMessages.noUserFound());
            }
            if (!await ServerEncryption.comparedStoredHashPasswordWithLoginPassword(req.body.currentPassword, databaseUsers[0].password)) {
                return res.status(401).json(await ResponseMessages.passwordsDoNotMatch());
            }
            const user = new User(databaseUsers[0].username, databaseUsers[0].email, req.body.newPassword);
            const updatePasswordResult = await UserDashboardDataAccess.updateUserPassword(databaseUsers[0]._id, user);
            if (updatePasswordResult.modifiedCount === 1) {
                res.status(200).json(await ResponseMessages.userChangedPasswordSuccessfully());
                const httpHelpers = new HttpHelpers();
                const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
                const userActions = new UserActionHelper();
                await userActions.userChangedPassword(databaseUsers[0]._id, ip, databaseUsers[0].password);
            } else {
                throw new Error("There was nothing updated when attemtping to update the users password");
            }
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }
}
