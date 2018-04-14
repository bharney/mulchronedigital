import { Router, Request, Response, NextFunction } from "express";
import BaseSubRouter from "../../classes/BaseSubRouter";
import { AdminDashboardDataAccess } from "../../../data-access/AdminDashboardDataAccess";
import { User } from "../../../models/User";
import { ResponseMessages } from "../../../globals/ResponseMessages";

export default class GetUsersRouter extends BaseSubRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    public configureRouter(): void {
        this.router.use("/", this.checkForUserJsonWebToken);
        this.router.use("/", this.checkForAdminJsonWebToken);
        this.router.get("/", this.getUserInformationForAdminDashboard);
    }

    private async getUserInformationForAdminDashboard(req: Request, res: Response, next: NextFunction) {
        try {
            const users: User[] = await AdminDashboardDataAccess.getUsersForAdminDashboardAdministration();
            return res.status(200).json(await ResponseMessages.successfulGetUsersForAdminDashboard(users));
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }
}