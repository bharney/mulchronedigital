import { Router, Request, Response, NextFunction } from "express";
import BaseSubRouter from "../../classes/BaseSubRouter";
import { ResponseMessages } from "../../../globals/ResponseMessages";
import { UserAuthenicationValidator } from "../../../../shared/UserAuthenicationValidator";
import { AdminDashboardDataAccess } from "../../../data-access/AdminDashboardDataAccess";

export default class ActivateUserRouter extends BaseSubRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    public configureRouter(): void {
        this.router.use("/", this.checkForUserJsonWebToken);
        this.router.use("/", this.checkForAdminJsonWebToken);
        this.router.use("/", this.decryptRequestBody);
        this.router.patch("/", this.activateUser);
    }

    private async activateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.body.id;
            if (!await UserAuthenicationValidator.isThisAValidMongoObjectId(userId)) {
                return res.status(422).json(await ResponseMessages.deactivatingUserAccountFailed());
            }
            if (!await AdminDashboardDataAccess.updateUsersAccountToActive(userId)) {
                return res.status(422).json(await ResponseMessages.deactivatingUserAccountFailed());
            }
            return res.status(200).json(await ResponseMessages.requestWasSuccessfulNoMessage());
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }
}