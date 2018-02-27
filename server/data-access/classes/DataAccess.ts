import { User } from "../../models/user";
import { DataAccessObjects } from "../objects/DataAccessObjects";
import { UsersCollection } from "../../master";

export class DataAccess {

    public static async findIfUserExistsByUsername(userName: string): Promise<User[]> {
        try {
            const query = await DataAccessObjects.findUserByUsernameQuery(userName);
            const projection = await DataAccessObjects.userObjectIdProjection();
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            // TODO: log it
            console.log(error);
            return [];
        }
    }
}
