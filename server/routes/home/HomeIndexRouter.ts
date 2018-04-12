import { Router } from "express";
import ContactMeRouter from "./ContactMeRouter";
import IBaseIndexRouter from "../classes/IBaseIndexRouter";

export default class HomeIndexRouter implements IBaseIndexRouter {
    public router: Router;
    private contactMeRouter: Router;

    constructor() {
        this.router = Router();
        this.createSubRouters();
        this.configureRouter();
    }

    public createSubRouters(): void {
        this.contactMeRouter = new ContactMeRouter().router;
    }

    public configureRouter(): void {
        this.router.use("/contactme", this.contactMeRouter);
    }
}
