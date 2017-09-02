import { Router } from "express";

export class IndexRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.configureRoutes();
  }

  private configureRoutes() {
    this.router.get("/api", (req, res) => {
      res.json({ welcome: "home" });
    });
    this.router.get("/", (req, res) => {
      res.sendFile(process.env.PWD + "/dist/client/index.html");
    });
  }
}
