import IEmailQueueMessage from "./IEmailQueueMessage";

export default class ForgotPasswordMessage implements IEmailQueueMessage {
    public type: string;
    public email: string;
    public tokenId: string;
    public newPassword: string;

    constructor(type: string) {
        this.type = type;
    }
}
