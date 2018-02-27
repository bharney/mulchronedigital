import { User } from "../../models/user";
import { DataAccessObjects } from "../objects/DataAccessObjects";
import { UsersCollection } from "../../cluster/master";

export class DataAccess {
    public dataAccessObjects = new DataAccessObjects();
    public usersArray: User[] = [];

    public async findIfUserExistsByUsername(userName: string): Promise<User[]> {
        try {
            const query = await this.dataAccessObjects.findUserByUsernameQuery(userName);
            const projection = await this.dataAccessObjects.userObjectIdProjection();
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            // TODO: log it
            console.log(error);
            return this.usersArray;
        }
    }
}
