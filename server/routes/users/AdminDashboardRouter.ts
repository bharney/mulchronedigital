import { Router, NextFunction, Request, Response } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { AdminDashboardDataAccess } from "../../data-access/AdminDashboardDataAccess";
import { User } from "../../models/User";

export class AdminDashboardRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.use("/getusers", this.checkForUserJsonWebToken);
        this.router.use("/getusers", this.checkForAdminJsonWebToken);
        this.router.get("/getusers", this.getUserInformationForAdminDashboard);
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
