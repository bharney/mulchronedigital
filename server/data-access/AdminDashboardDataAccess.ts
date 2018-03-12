import { DataAccess } from "./classes/DataAccess";
import errorLogger from "../logging/ErrorLogger";
import { User } from "../models/user";
import { UsersCollection } from "../config/master";
import { DataAccessObjects } from "./objects/DataAccessObjects";

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
}
