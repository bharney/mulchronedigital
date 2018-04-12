import { Router, Request, Response, NextFunction } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import { ContactMe } from "../../../shared/ContactMe";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { EmailQueueExport } from "../../config/master";

export default class ContactMeRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.use("/", this.decryptRequestBody);
        this.router.post("/", this.validateContactMe);
    }

    public async validateContactMe(req: Request, res: Response, next: NextFunction) {
        try {
            const contactMeObject: ContactMe = req.body;
            if (contactMeObject.userName.length < 3) {
                return res.status(422).json(await ResponseMessages.contactMeNameNotLongEnough());
            }
            if (!await UserAuthenicationValidator.isEmailValid(contactMeObject.userEmail)) {
                return res.status(422).json(await ResponseMessages.emailIsNotValid());
            }
            if (contactMeObject.message.length < 25) {
                return res.status(422).json(await ResponseMessages.contactMeMessageNotLongEnough());
            }
            if (await EmailQueueExport.sendContactMeMessageToQueue(contactMeObject)) {
                return res.status(200).json(await ResponseMessages.contactMeSucess(contactMeObject.userName, contactMeObject.userEmail));
            }
            throw new Error("Was unable to send the contact message to RabbitMQ");
        } catch (error) {
            res.status(503).json(await ResponseMessages.generalError());
            return next(error);
        }
    }
}