import { Router } from "express";
import GetUsersRouter from "./GetUsersRouter";

export default class AdminDashboardIndexRouter {
    public router: Router;
    private getUsersRouter: Router;

    constructor() {
        this.router = Router();
        this.createSubRouters();
        this.configureRouter();
    }

    private createSubRouters(): void {
        this.getUsersRouter = new GetUsersRouter().router;
    }

    private configureRouter(): void {
        this.router.use("/getusers", this.getUsersRouter);
    }
}
