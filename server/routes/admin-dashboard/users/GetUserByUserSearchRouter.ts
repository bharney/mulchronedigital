import { Router, Request, Response, NextFunction } from "express";
import BaseSubRouter from "../../classes/BaseSubRouter";
import { AdminDashboardDataAccess } from "../../../data-access/AdminDashboardDataAccess";
import { User } from "../../../models/User";
import { ResponseMessages } from "../../../globals/ResponseMessages";

export default class GetUserByUserSearchRouter extends BaseSubRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    public configureRouter(): void {
        this.router.use("/:usernamesearch", this.checkForUserJsonWebToken);
        this.router.use("/:usernamesearch", this.checkForAdminJsonWebToken);
        this.router.get("/:usernamesearch", this.getUserInformationForAdminDashboard);
    }

    private async getUserInformationForAdminDashboard(req: Request, res: Response, next: NextFunction) {
        try {
            const usernameSearch = req.params.usernamesearch;
            const users: User[] = await AdminDashboardDataAccess.getUsersByUsernameSearch(usernameSearch);
            return res.status(200).json(await ResponseMessages.successfulGetUsersForAdminDashboard(users));
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }
}