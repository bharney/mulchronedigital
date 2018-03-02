import { Router, Request, Response } from "express";
import { UserAuthenicationRouter } from "./users/UserAuthenicationRouter";
import { UserDashboardRouter } from "./users/UserDashboardRouter";
import { HomeRouter } from "./home/HomeRouter";

export class IndexRouter {
  public router: Router;
  private userAuthenicationRouter: Router;
  private userDashboardRouter: Router;
  public homeRouter: Router;

  constructor() {
    this.router = Router();
    this.createSubRouters();
    this.configureRoutes();
  }

  private createSubRouters() {
    this.userAuthenicationRouter = new UserAuthenicationRouter().router;
    this.userDashboardRouter = new UserDashboardRouter().router;
    this.homeRouter = new HomeRouter().router;
  }

  private configureRoutes() {
    this.router.use("/api/userauth", this.userAuthenicationRouter);
    this.router.use("/api/userdashboard", this.userDashboardRouter);
    this.router.use("/api/home", this.homeRouter);
  }
}
