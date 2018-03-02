import { BaseRouter } from "../classes/BaseRouter";
import { Router, NextFunction, Request, Response } from "express";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { ContactMe } from "../../../shared/ContactMe";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { EmailQueueExport } from "../../master";

export class HomeRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.use("/contactme", this.decryptRequestBody);
        this.router.post("/contactme", this.validateContactMe);
    }

    public async validateContactMe(req: Request, res: Response, next: NextFunction) {
        try {
            const contactMeObject: ContactMe = req.body;
            if (contactMeObject.userName.length < 3) {
                return res.status(422).json(ResponseMessages.contactMeNameNotLongEnough());
            }
            if (!await UserAuthenicationValidator.isEmailValid(contactMeObject.userEmail)) {
                return res.status(422).json(ResponseMessages.emailIsNotValid());
            }
            if (contactMeObject.message.length < 25) {
                return res.status(422).json(ResponseMessages.contactMeMessageNotLongEnough());
            }
            if (await EmailQueueExport.sendContactMeMessageToQueue(contactMeObject)) {
                return res.status(200).json(ResponseMessages.contactMeSucess(contactMeObject.userName, contactMeObject.userEmail));
            }
            throw new Error("Was unable to send the contact message to RabbitMQ");
        } catch (error) {
            res.status(503).json(ResponseMessages.generalError());
            return next(error);
        }
    }
}
