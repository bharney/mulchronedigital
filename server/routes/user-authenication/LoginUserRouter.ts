import { Router, Request, Response, NextFunction } from "express";
import BaseSubRouter from "../classes/BaseSubRouter";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { User } from "../../models/User";
import { DataAccess } from "../../data-access/classes/DataAccess";
import { ServerEncryption } from "../../security/ServerEncryption";
import { HttpHelpers } from "../../globals/HttpHelpers";
import { DnsHelpers } from "../../globals/DnsHelpers";
import { UserAuthenicationDataAccess } from "../../data-access/UserAuthenicationDataAccess";
import { UserIpAddress } from "../classes/UserIpAddress";
import { UserActionHelper } from "../../helpers/UserActionHelper";

export default class LoginUserRouter extends BaseSubRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    public configureRouter(): void {
        this.router.use("/", this.decryptRequestBody);
        this.router.post("/", this.validateLoginUserRequest);
    }

    private async validateLoginUserRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const userEmail = req.body.email;
            const userPassword = req.body.password;
            if (!await UserAuthenicationValidator.isEmailValid(userEmail)) {
                return res.status(401).json(await ResponseMessages.emailIsNotValid());
            }
            if (!await UserAuthenicationValidator.isPasswordValid(userPassword)) {
                return res.status(401).json(await ResponseMessages.passwordIsNotValid());
            }
            const databaseUsers: User[] = await DataAccess.findUserLoginDetailsByEmail(userEmail);
            // should only be one user with this email
            if (databaseUsers.length === 1) {
                if (!databaseUsers[0].isActive) {
                    return res.status(401).json(await ResponseMessages.userAccountNotActive(databaseUsers[0].username));
                } else if (!await ServerEncryption.comparedStoredHashPasswordWithLoginPassword(userPassword, databaseUsers[0].password)) {
                    return res.status(401).json(await ResponseMessages.passwordsDoNotMatch());
                } else {
                    res.status(200).json(await ResponseMessages.successfulUserLogin(databaseUsers[0]));
                    // TODO: MAKE A FUNCTION!!!!
                    const httpHelpers = new HttpHelpers();
                    const userId = databaseUsers[0]._id;
                    const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
                    const domain = await DnsHelpers.reverseDNSLookup(ip);
                    const userAgent = await httpHelpers.getUserAgentFromRequestObject(req.headers);
                    const ipAddressObject = new UserIpAddress(ip, userAgent, domain);
                    const matchingUserIpAddresses = await UserAuthenicationDataAccess.findMatchingIpAddressbyUserId(userId, ip);
                    if (matchingUserIpAddresses[0].ipAddresses === undefined) {
                        // TODO: we are now associating a new or unknown IP address to the user.
                        // we probably dont have to await this, but here is where we can pass something out to RabbitMQ... maybe????
                        await UserAuthenicationDataAccess.updateUserProfileIpAddresses(userId, ipAddressObject);
                    }
                    const userActions = new UserActionHelper();
                    await userActions.userLoggedIn(userId, ip);
                }
            } else {
                return res.status(401).json(await ResponseMessages.noUserFound());
            }
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }
}