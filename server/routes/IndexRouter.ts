import { Router, Request, Response } from "express";
import { HtmlRouter } from "./html/HtmlRouter";
import { UserAuthenicationRouter } from "./users/UserAuthenicationRouter";
import { UserDashboardRouter } from "./users/UserDashboard";

export class IndexRouter {
  public router: Router;
  private htmlRouter: Router;
  private userAuthenicationRouter: Router;
  private userDashboardRouter: Router;

  constructor() {
    this.router = Router();
    this.createSubRouters();
    this.configureRoutes();
  }

  private createSubRouters() {
    this.htmlRouter = new HtmlRouter().router;
    this.userAuthenicationRouter = new UserAuthenicationRouter().router;
    this.userDashboardRouter = new UserDashboardRouter().router;
  }

  private configureRoutes() {
    this.router.use("/api/userauth", this.userAuthenicationRouter);
    this.router.use("/api/userdashboard", this.userDashboardRouter);
    this.router.use("/", this.htmlRouter);
  }
}
