import { User } from "../models/user";
import { ContactMe } from "../../shared/ContactMe";

export class QueueMessages {

    public userActivationDetailsMessage(user: User): object {
        return new Promise(resolve => {
            const message = {
                "type": "activate_user",
                "username": user.username,
                "email": user.email,
                "_id": user._id
            };
            resolve(message);
        });
    }

    public userForgotPasswordMessage(email: string, userId: string, tokenId: string, newPassword: string): object {
        return new Promise(resolve => {
            const message = {
                "type": "user_forgot_password",
                "email": email,
                "tokenId": tokenId,
                "newPassword": newPassword
            };
            resolve(message);
        });
    }

    public contactMeFormMessage(contactMeObject: ContactMe): object {
        return new Promise(resolve => {
            const message = {
                "type": "contact_me_message",
                "userName": contactMeObject.userName,
                "userEmail": contactMeObject.userEmail,
                "message": contactMeObject.message
            };
            resolve(message);
        });
    }
}
