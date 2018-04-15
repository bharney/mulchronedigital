import { Router } from "express";
import GetUsersRouter from "./users/GetUsersRouter";
import IBaseIndexRouter from "../classes/IBaseIndexRouter";
import ActivateUserRouter from "../user-authenication/ActivateUserRouter";
import DeactivateUserRouter from "./users/DeactivateUserRouter";
import MakeUserAdminRouter from "./users/MakeUserAdminRouter";
import RevokeUserAdminRouter from "./users/RevokeUserAdminAccessRouter";
import GetUserByUserSearchRouter from "./users/GetUserByUserSearchRouter";

export default class AdminDashboardIndexRouter implements IBaseIndexRouter {
    public router: Router;
    private getUsersRouter: Router;
    private deactiveUserRouter: Router;
    private activateUserRouter: Router;
    private makeUserAdminRouter: Router;
    private revokeUserAdminRouter: Router;
    private getUsersByUsernameSearchRouter: Router;

    constructor() {
        this.router = Router();
        this.createSubRouters();
        this.configureRouter();
    }

    public createSubRouters(): void {
        this.getUsersRouter = new GetUsersRouter().router;
        this.deactiveUserRouter = new DeactivateUserRouter().router;
        this.activateUserRouter = new ActivateUserRouter().router;
        this.makeUserAdminRouter = new MakeUserAdminRouter().router;
        this.revokeUserAdminRouter = new RevokeUserAdminRouter().router;
        this.getUsersByUsernameSearchRouter = new GetUserByUserSearchRouter().router;
    }

    public configureRouter(): void {
        this.router.use("/getusers", this.getUsersRouter);
        this.router.use("/deactivateuser", this.deactiveUserRouter);
        this.router.use("/activateuser", this.activateUserRouter);
        this.router.use("/makeuseradmin", this.makeUserAdminRouter);
        this.router.use("/revokeuseradminaccess", this.revokeUserAdminRouter);
        this.router.use("/getusersbyusername", this.getUsersByUsernameSearchRouter);
    }
}
