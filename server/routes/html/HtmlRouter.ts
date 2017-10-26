import path = require("path");
import { Router, Request, Response } from "express";

export class HtmlRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter() {
        this.router.get("*", this.sendClientTheApplication);
    }

    private sendClientTheApplication(req: Request, res: Response) {
        res.sendFile(path.join(process.env.PWD + "/dist/client/index.html"));
    }
}
