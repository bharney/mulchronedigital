import { User } from "../models/user";

export class QueueMessages {

    public  userActivationDetailsMessage(user: User): object {
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

    public userForgotPasswordMessage(email: string, userId: string, tokenId: string): object {
        return new Promise(resolve => {
            const message = {
                "type": "user_forgot_password",
                "email": email,
                "token_id": tokenId
            };
            resolve(message);
        });
    }
}
