import { Router, Request, Response } from "express";
import { UserAuthenicationRouter } from "./users/UserAuthenicationRouter";
import { HomeRouter } from "./home/HomeRouter";
import { AdminDashboardRouter } from "./users/AdminDashboardRouter";
import { UserDashboardRouterIndex } from "./user-dashbord/UserDashboardIndexRouter";

export class IndexRouter {
  public router: Router;
  public userAuthenicationRouter: Router;
  public userDashboardRouter: Router;
  public homeRouter: Router;
  public adminDashboardRouter: Router;

  constructor() {
    this.router = Router();
    this.createSubRouters();
    this.configureRoutes();
  }

  private createSubRouters() {
    this.userAuthenicationRouter = new UserAuthenicationRouter().router;
    this.userDashboardRouter = new UserDashboardRouterIndex().router;
    this.homeRouter = new HomeRouter().router;
    this.adminDashboardRouter = new AdminDashboardRouter().router;
  }

  private configureRoutes() {
    this.router.use("/api/userauth", this.userAuthenicationRouter);
    this.router.use("/api/userdashboard", this.userDashboardRouter);
    this.router.use("/api/home", this.homeRouter);
    this.router.use("/api/admindashboard", this.adminDashboardRouter);
  }
}
