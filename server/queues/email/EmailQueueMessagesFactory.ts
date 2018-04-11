import ActivateUserEmailMessage from "./messages/ActivateUserEmailMessage";
import ForgotPasswordMessage from "./messages/ForgotPasswordMessage";
import ContactMeMessage from "./messages/ContactMeMessage";
import { ContactMe } from "../../../shared/ContactMe";

export class EmailQueueMessagesFactory {

    public async getEmailQueueMessage(type: string): Promise<any> {
        return new Promise(resolve => {
            switch (type) {
                case "activate_user_email":
                    resolve(new ActivateUserEmailMessage(type));
                    break;
                case "user_forgot_password":
                    resolve(new ForgotPasswordMessage(type));
                    break;
                case "contact_me_message":
                    resolve(new ContactMeMessage(type));
                    break;
            }
        });
    }
}
