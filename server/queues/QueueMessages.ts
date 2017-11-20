import { User } from "../models/user";

export class QueueMessages {

    public  userActivationDetailsMessage(user: User): object {
        return new Promise(resolve => {
            const message = {
                "username": user.username,
                "email": user.email,
                "_id": user._id
            };
            resolve(message);
        });
    }
}
