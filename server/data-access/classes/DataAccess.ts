import { User } from "../../models/user";
import { DataAccessObjects } from "../objects/DataAccessObjects";
import { UsersCollection } from "../../config/master";
import errorLogger from "../../logging/ErrorLogger";

export class DataAccess {

    public static async findIfUserExistsByUsername(userName: string): Promise<User[]> {
        try {
            const query = await DataAccessObjects.findUserByUsernameQuery(userName);
            const projection = await DataAccessObjects.userObjectIdProjection();
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
            return await UsersCollection.updateOne(query, projection);
        } catch (error) {
            errorLogger.error(error);
            return null;
        }
    }

    public static async findUserLoginDetailsByEmail(userEmail: string) {
        try {
            const query = await DataAccessObjects.findUserByEmailAndIsActiveQuery(userEmail);
            const projection = await DataAccessObjects.userLoginProjection();
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
            console.log(error);
        }
    }

    public static async getUserPassword(userId: string): Promise<User[]> {
        try {
          const query = await DataAccessObjects.findUserByIdQuery(userId);
          const projection = await DataAccessObjects.usernamePasswordAndIdProjection();
          return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
          errorLogger.error(error);
          return [];
        }
      }
}
