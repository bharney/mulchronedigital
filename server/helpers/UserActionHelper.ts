import { UserAction, UserLoggedIn, UserChangedPassword } from "../models/UserAction";
import { UserActionsCollection } from "../cluster/master"; 
import { ObjectId } from "mongodb";

export class UserActionHelper {
    private userLoggedInActionType: string = "user_logged_in";
    private userChangedPasswordActionType: string = "user_changed_password";
    constructor() {

    }

    public async userLoggedIn(userId: ObjectId, ip: string): Promise<any> {
        try {
            const userAction = new UserLoggedIn(userId, ip, this.userLoggedInActionType);
            await this.insertUserAction(userAction);
        } catch (error) {
            console.log(error);
        }
    }

    public async userChangedPassword(userId: ObjectId, ip: string, oldPassword: string) {
        try {
            const userAction = new UserChangedPassword(userId, ip, this.userChangedPasswordActionType, oldPassword);
            await this.insertUserAction(userAction);
        } catch (error) {
            console.log(error);
        }
    }

    private async insertUserAction(action: UserAction): Promise<any> {
        try {
            console.log(action);
            await UserActionsCollection.insertOne(action);
        } catch (error) {
            console.log(error);
        }
    }
}
