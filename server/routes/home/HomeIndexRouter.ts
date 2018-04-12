import { Router } from "express";
import ContactMeRouter from "./ContactMeRouter";

export default class HomeIndexRouter {
    public router: Router;
    private contactMeRouter: Router;

    constructor() {
        this.router = Router();
        this.createSubRouters();
        this.configureRouter();
    }

    private createSubRouters(): void {
        this.contactMeRouter = new ContactMeRouter().router;
    }

    private configureRouter(): void {
        this.router.use("/contactme", this.contactMeRouter);
    }
}
