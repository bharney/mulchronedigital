import { Router, Request, NextFunction, Response } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import { UserAuthenicationValidation } from "../classes/UserAuthenicationValidation";


export class UserAuthenicationRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.use("/registeruser", this.createStandardLocalResponseObjects);
        this.router.post("/registeruser", this.validateRegisterUserRequest);
    }

    private async validateRegisterUserRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            if (!await UserAuthenicationValidation.isUserNameValid(username)) {
                res.json({"status": false, "message": res.locals.responseMessages.usernameIsNotValid});
                return;
            }  
            
            if (!await UserAuthenicationValidation.isEmailValid(email)) {
                res.json({"status": false, "message": res.locals.responseMessages.emailIsNotValid});
                return;
            }  
            
            if (!await UserAuthenicationValidation.isPasswordValid(password)) {
                res.json({"status": false, "message": res.locals.responseMessages.passwordIsNotValid});
                return;
            }
            res.json({"blah it worked": "testing"});
        } catch (error) {
            // TODO: router error handler
            throw error;
        }
    }
}
