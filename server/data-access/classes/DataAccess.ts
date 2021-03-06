import { User } from "../../models/User";
import { DataAccessObjects } from "../objects/DataAccessObjects";
import { UsersCollection, usersCollectionIsFalsy, UserActionsCollection } from "../../config/master";
import errorLogger from "../../logging/ErrorLogger";
import { Database } from "../../globals/Database";

export class DataAccess {

    public static async findIfUserExistsByUsername(userName: string): Promise<User[]> {
        try {
            if (!userName) {
                return [];
            }
            const query = await DataAccessObjects.findUserByUsernameQuery(userName);
            const projection = await DataAccessObjects.userObjectIdProjection();
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
            return [];
        }
    }

    public static async updateUserPassword(userId: string, user: User): Promise<any> {
        try {
            if (!userId || !user) {
                return null;
            }
            if (!await user.updateUserPassword()) {
                throw new Error("new password failed at updateUserPassword(user: User)");
            }
            const query = await DataAccessObjects.findUserByIdQuery(userId);
            const projection = await DataAccessObjects.updateUserPasswordProjection(user.password, user.modifiedAt);
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
            return await UsersCollection.updateOne(query, projection);
        } catch (error) {
            errorLogger.error(error);
            return null;
        }
    }

    public static async findUserPasswordsFromThirtyDaysAgo(userId: string): Promise<any> {
        try {
            if (!userId) {
                return null;
            }
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
            const query = await DataAccessObjects.userPasswordsFromThirtyDaysAgoQuery(userId);
            const projection = await DataAccessObjects.userPasswordsFromThirtyDaysAgoProjection();
            return await UserActionsCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
            return null;
        }
    }

    public static async findUserLoginDetailsByEmail(userEmail: string): Promise<User[]> {
        try {
            if (!userEmail) {
                return [];
            }
            const query = await DataAccessObjects.findUserByEmailQuery(userEmail);
            const projection = await DataAccessObjects.userLoginProjection();
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
            return [];
        }
    }

    public static async getUserPassword(userId: string): Promise<User[]> {
        try {
            if (!userId) {
                return [];
            }
            const query = await DataAccessObjects.findUserByIdQuery(userId);
            const projection = await DataAccessObjects.usernamePasswordAndIdProjection();
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
            return [];
        }
    }
}
