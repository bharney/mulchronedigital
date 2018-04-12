import { Router, Request, Response, NextFunction } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import { AdminDashboardDataAccess } from "../../data-access/AdminDashboardDataAccess";
import { User } from "../../models/User";
import { ResponseMessages } from "../../globals/ResponseMessages";

export default class GetUsersRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
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