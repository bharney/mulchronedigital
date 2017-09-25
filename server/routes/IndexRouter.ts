import { Router, Request, Response } from "express";
import { HtmlRouter } from "./html/html-router";
import { UserAuthenicationRouter } from "./user-authenication/UserAuthenicationRouter";

export class IndexRouter {
  public router: Router;
  private htmlRouter: Router;
  private userAuthenicationRouter: Router;

  constructor() {
    this.router = Router();
    this.createSubRouters();
    this.configureRoutes();
  }

  private createSubRouters() {
    this.htmlRouter = new HtmlRouter().router;
    this.userAuthenicationRouter = new UserAuthenicationRouter().router;
  }

  private configureRoutes() {
    this.router.use("/api/userauth", this.userAuthenicationRouter);
    this.router.use("/", this.htmlRouter);
  }
}
