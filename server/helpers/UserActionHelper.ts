import { UserAction } from "../models/UserAction";
import { UserActionsCollection } from "../cluster/master"; 
import { ObjectId } from "mongodb";

export class UserActionHelper {
    private userLoggedInActionType: string = "user_logged_in";
    constructor() {

    }

    public async userLoggedIn(userId: ObjectId, ip: string): Promise<any> {
        try {
            const userAction = new UserAction(userId, ip, this.userLoggedInActionType);
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
