import { DataAccess } from "./classes/DataAccess";
import errorLogger from "../logging/ErrorLogger";
import { User } from "../models/User";
import { UsersCollection } from "../config/master";
import { DataAccessObjects } from "./objects/DataAccessObjects";
import { UserAuthenicationValidator } from "../../shared/UserAuthenicationValidator";

export class AdminDashboardDataAccess extends DataAccess {

    public static async getUsersForAdminDashboardAdministration(): Promise<User[]> {
        try {
            const query = await DataAccessObjects.blankQuery();
            const projection = await DataAccessObjects.getUsersForAdminDashboardProjection();
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
            return [];
        }
    }

    public static async updateUsersAdminAccessToFalse(userId: string): Promise<boolean> {
        try {
            const query = await DataAccessObjects.findUserByIdQuery(userId);
            const projection = await DataAccessObjects.updateUserAdminAccessToFalseProjection();
            const result =  await UsersCollection.updateOne(query, projection);
            if (result.result.n === 1 && result.result.nModified === 1 && result.result.ok === 1) {
                return true;
            }
            return false;
        } catch (error) {
            errorLogger.error(error);
            return false;
        }
    }

    public static async updateUsersAdminAccessToTrue(userId: string): Promise<boolean> {
        try {
            const query = await DataAccessObjects.findUserByIdQuery(userId);
            const projection = await DataAccessObjects.updateUserAdminAccessToTrueProjection();
            const result =  await UsersCollection.updateOne(query, projection);
            if (result.result.n === 1 && result.result.nModified === 1 && result.result.ok === 1) {
                return true;
            }
            return false;
        } catch (error) {
            errorLogger.error(error);
            return false;
        }
    }
}
