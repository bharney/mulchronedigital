import IEmailQueueMessage from "./IEmailQueueMessage";

export default class ContactMeMessage implements IEmailQueueMessage {
    public type: string;
    public userName: string;
    public userEmail: string;
    public message: string;

    constructor(type: string) {
        this.type = type;
    }
}
