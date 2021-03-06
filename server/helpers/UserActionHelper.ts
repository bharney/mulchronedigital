import { UserAction, UserChangedPasswordAction, UserChangedUsernameAction, UserForgotPasswordAction, UserLoggedInAction } from "../models/UserAction";
import { UserActionsCollection, usersActionCollectionIsFalsy } from "../config/master";
import errorLogger from "../logging/ErrorLogger";

export class UserActionHelper {
    private userLoggedInActionType: string = "user_logged_in";
    private userChangedPasswordActionType: string = "user_changed_password";
    private userChangedUsernameAction: string = "user_changed_username";
    private userForgotPasswordAction: string = "user_forgot_password";

    constructor() {

    }

    public async userLoggedIn(userId: string, ip: string): Promise<any> {
        try {
            const userAction = new UserLoggedInAction(userId, ip, this.userLoggedInActionType);
            await this.insertUserAction(userAction);
        } catch (error) {
            errorLogger.error(error);
        }
    }

    public async userChangedPassword(userId: string, ip: string, oldPassword: string) {
        try {
            const userAction = new UserChangedPasswordAction(userId, ip, this.userChangedPasswordActionType, oldPassword);
            await this.insertUserAction(userAction);
        } catch (error) {
            errorLogger.error(error);
        }
    }

    public async userChangedUsername(userId: string, ip: string, oldUsername: string) {
        try {
            const userAction = new UserChangedUsernameAction(userId, ip, this.userChangedUsernameAction, oldUsername);
            await this.insertUserAction(userAction);
        } catch (error) {
            errorLogger.error(error);
        }
    }

    public async userForgotPassword(userId: string, ip: string, forgotPasswordTokenId: string): Promise<any> {
        try {
            const userAction = new UserForgotPasswordAction(userId, ip, this.userForgotPasswordAction, forgotPasswordTokenId);
            await this.insertUserAction(userAction);
        } catch (error) {
            errorLogger.error(error);
        }
    }

    private async insertUserAction(action: UserAction): Promise<any> {
        try {
            if (!UserActionsCollection) {
                await usersActionCollectionIsFalsy();
            }
            await UserActionsCollection.insertOne(action);
        } catch (error) {
            errorLogger.error(error);
        }
    }
}
