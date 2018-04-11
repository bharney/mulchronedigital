import IEmailQueueMessage from "./IEmailQueueMessage";

export default class ActivateUserEmailMessage implements IEmailQueueMessage {
    public type: string;
    public username: string;
    public email: string;
    public _id: string;

    constructor(type: string) {
        this.type = type;
    }
}
