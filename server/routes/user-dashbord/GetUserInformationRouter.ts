import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { UserDashboardDataAccess } from "../../data-access/UserDashboardDataAccess";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { User } from "../../models/User";

export default class GetUserInformationRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.use("/", this.checkForUserJsonWebToken);
        this.router.get("/", this.getUserInformation);
    }

    private async getUserInformation(req: Request, res: Response, next: NextFunction) {
        try {
            const databaseUsers: User[] = await UserDashboardDataAccess.getUserDashboardInformation(res.locals.token.id);
            if (databaseUsers.length <= 0) {
                return res.status(503).json(await ResponseMessages.generalError());
            }
            // we are looking by object id there should only be one user in this array.
            return res.status(200).json(await ResponseMessages.dashboardUserFound(databaseUsers[0]));
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }
}
