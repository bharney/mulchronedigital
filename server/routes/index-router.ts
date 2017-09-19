import { Router, Request, Response } from "express";

export class IndexRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configureRoutes();
  }

  private configureRoutes() {
    this.router.get("/api", (req: Request , res: Response) => {
      res.json({ welcome: "home" });
    });
    this.router.get("/", (req: Request, res: Response) => {
      res.sendFile(process.env.PWD + "/dist/client/index.html");
    });
  }
}
