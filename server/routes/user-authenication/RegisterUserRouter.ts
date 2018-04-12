import { Router, Request, Response, NextFunction } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import { UserAuthenicationDataAccess } from "../../data-access/UserAuthenicationDataAccess";
import { User } from "../../models/User";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { HttpHelpers } from "../../globals/HttpHelpers";
import { DnsHelpers } from "../../globals/DnsHelpers";
import { UserIpAddress } from "../classes/UserIpAddress";
import { EmailQueueExport } from "../../config/master";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";

export default class RegisterUserRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.use("/", this.decryptRequestBody);
        this.router.use("/", this.doesUsernameOrEmailExistAlready);
        this.router.post("/", this.insertNewUser);
    }

    private async validateRegisterUserRequest(req: Request, res: Response, next: NextFunction) {
        try {
            if (!await UserAuthenicationValidator.isUserNameValid(req.body.username)) {
                return res.status(422).json(await ResponseMessages.userNameIsNotValid());
            }
            if (!await UserAuthenicationValidator.isEmailValid(req.body.email)) {
                return res.status(422).json(await ResponseMessages.emailIsNotValid());
            }
            if (!await UserAuthenicationValidator.isPasswordValid(req.body.password)) {
                return res.status(422).json(await ResponseMessages.passwordIsNotValid());
            }
            next();
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }

    private async doesUsernameOrEmailExistAlready(req: Request, res: Response, next: NextFunction) {
        try {
            const databaseUser: User[] = await UserAuthenicationDataAccess.findIfUserExistsByUsername(req.body.username);
            if (databaseUser.length > 0) {
                return res.status(409).json(await ResponseMessages.usernameIsTaken(req.body.username));
            }
            const databaseEmail: User[] = await UserAuthenicationDataAccess.findIfUserExistsByEmail(req.body.email);
            if (databaseEmail.length > 0) {
                return res.status(409).json(await ResponseMessages.emailIsTaken(req.body.email));
            }
            next();
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }

    private async insertNewUser(req: Request, res: Response, next: NextFunction) {
        try {
            const httpHelpers = new HttpHelpers();
            const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
            const domain = await DnsHelpers.reverseDNSLookup(ip);
            const userAgent = await httpHelpers.getUserAgentFromRequestObject(req.headers);
            const ipAddressObject = new UserIpAddress(ip, userAgent, domain);
            const newUser = new User(req.body.username, req.body.email, req.body.password, ipAddressObject);
            // TODO: split this up into seperate functions. little messy;
            if (await newUser.SetupNewUser()) {
                const insertResult = await UserAuthenicationDataAccess.insertNewUser(newUser);
                if (insertResult.result.n === 1) {
                    res.status(200).json(await ResponseMessages.userRegistrationSuccessful(req.body.username, req.body.email));
                    EmailQueueExport.sendUserActivationEmailToQueue(newUser);
                } else {
                    return res.status(503).json(await ResponseMessages.generalError());
                }
            } else {
                return res.status(503).json(await ResponseMessages.generalError());
            }
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }
}