import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { HttpHelpers } from "../../globals/HttpHelpers";
import { DnsHelpers } from "../../globals/DnsHelpers";
import { UserDashboardDataAccess } from "../../data-access/UserDashboardDataAccess";
import { UserIpAddress } from "../classes/UserIpAddress";
import { UserAuthenicationDataAccess } from "../../data-access/UserAuthenicationDataAccess";

export default class UpdateUserLocationRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.use("/", this.checkForUserJsonWebToken);
        this.router.patch("/", this.updateUserLocationInformation);
    }

    private async updateUserLocationInformation(req: Request, res: Response, next: NextFunction) {
        try {
            const latitude = req.body.latitude;
            const longitude = req.body.longitude;
            if (typeof latitude !== "number" || typeof longitude !== "number") {
                return res.status(409).json(await ResponseMessages.generalError());
            }
            const httpHelpers = new HttpHelpers();
            const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
            const domain = await DnsHelpers.reverseDNSLookup(ip);
            const userAgent = await httpHelpers.getUserAgentFromRequestObject(req.headers);
            const userId = res.locals.token.id;
            const updatedProfile = await UserDashboardDataAccess.updateUserLocationForIpAddress(userId, ip, domain, latitude, longitude, userAgent);
            if (updatedProfile.result.n === 1) {
                return res.status(200);
            }
            // if there was no ip address object to update, attempt to create a new one.
            const ipAdressObject = new UserIpAddress(ip, userAgent, domain, latitude, longitude);
            UserAuthenicationDataAccess.updateUserProfileIpAddresses(userId, ipAdressObject);
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }
}
