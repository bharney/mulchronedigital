import { User } from "../../models/User";
import { DataAccessObjects } from "../objects/DataAccessObjects";
import { UsersCollection, usersCollectionIsFalsy } from "../../config/master";
import errorLogger from "../../logging/ErrorLogger";
import { Database } from "../../globals/Database";

export class DataAccess {

    public static async findIfUserExistsByUsername(userName: string): Promise<User[]> {
        try {
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
