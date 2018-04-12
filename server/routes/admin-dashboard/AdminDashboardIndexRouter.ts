import { Router } from "express";
import GetUsersRouter from "./GetUsersRouter";
import IBaseIndexRouter from "../classes/IBaseIndexRouter";

export default class AdminDashboardIndexRouter implements IBaseIndexRouter {
    public router: Router;
    private getUsersRouter: Router;

    constructor() {
        this.router = Router();
        this.createSubRouters();
        this.configureRouter();
    }

    public createSubRouters(): void {
        this.getUsersRouter = new GetUsersRouter().router;
    }

    public configureRouter(): void {
        this.router.use("/getusers", this.getUsersRouter);
    }
}
