import { Router, Request, Response } from "express";
import { HtmlRouter } from "./html/html-router";

export class IndexRouter {
  public router: Router;
  private htmlRouter: Router;

  constructor() {
    this.router = Router();
    this.htmlRouter = new HtmlRouter().router;
    this.configureRoutes();
  }

  private configureRoutes() {
    this.router.get("/api", (req: Request, res: Response) => {
      res.json({ welcome: "home" });
    });
    this.router.use("/", this.htmlRouter);
  }
}
