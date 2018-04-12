import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { UserAuthenicationDataAccess } from "../../data-access/UserAuthenicationDataAccess";
import { ResponseMessages } from "../../globals/ResponseMessages";

export default class ActivateUserRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.use("/", this.decryptRequestBody);
        this.router.patch("/", this.validateActivateUser);
    }

    private async validateActivateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.body.id;
            if (!await UserAuthenicationValidator.isThisAValidMongoObjectId(userId)) {
                // TODO: create some kind of message.
                return res.status(401).json(await ResponseMessages.generalError());
            }
            const updatedProfile = await UserAuthenicationDataAccess.updateUserProfileIsActive(userId);
            if (updatedProfile.lastErrorObject.updatedExisting && updatedProfile.lastErrorObject.n === 1) {
                return res.status(200).json(await ResponseMessages.userAccountActiveSuccess());
            } else {
                return res.status(401).json(await ResponseMessages.generalError());
            }
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }
}