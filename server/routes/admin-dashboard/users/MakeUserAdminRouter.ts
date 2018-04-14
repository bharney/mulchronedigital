import { Router, Request, Response, NextFunction } from "express";
import BaseSubRouter from "../../classes/BaseSubRouter";
import { ResponseMessages } from "../../../globals/ResponseMessages";

export default class MakeUserAdminRouter extends BaseSubRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    public configureRouter(): void {
        this.router.use("/", this.checkForUserJsonWebToken);
        this.router.use("/", this.checkForAdminJsonWebToken);
        this.router.use("/", this.decryptRequestBody);
        this.router.patch("/", this.makeUserAdmin);
    }

    private async makeUserAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }
}