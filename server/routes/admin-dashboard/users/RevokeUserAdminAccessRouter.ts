import { Router, Request, Response, NextFunction } from "express";
import BaseSubRouter from "../../classes/BaseSubRouter";
import { ResponseMessages } from "../../../globals/ResponseMessages";
import { AdminDashboardDataAccess } from "../../../data-access/AdminDashboardDataAccess";
import { UserAuthenicationValidator } from "../../../../shared/UserAuthenicationValidator";

export default class RevokeUserAdminRouter extends BaseSubRouter {
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
        this.router.patch("/", this.revokeUserAdminAccess);
    }

    private async revokeUserAdminAccess(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.body.id;
            if (!await UserAuthenicationValidator.isThisAValidMongoObjectId(userId)) {
                return res.status(422).json(await ResponseMessages.revokingAdminAccessFailed());
            }
            if (!await AdminDashboardDataAccess.updateUsersAdminAccessToFalse(userId)) {
                return res.status(422).json(await ResponseMessages.revokingAdminAccessFailed());
            }
            return res.status(200).json(await ResponseMessages.requestWasSuccessfulNoMessage());
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }
}