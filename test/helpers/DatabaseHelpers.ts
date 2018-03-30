import { UsersCollection, UserActionsCollection, usersCollectionIsFalsy } from "../../server/config/master";

export class DatabaseHelpers {
    public static async deleteUserFromDatabaseByUsername(username: string): Promise<boolean> {
        try {
            if (!username)
                return false;
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
            const deleteResult = await UsersCollection.deleteOne({ username: username });
            if (deleteResult.result.n === 1 && deleteResult.result.ok === 1)
                return true;

            return false;
        } catch (error) {
            return false;
        }
    }

    public static async getUsersJsonWebTokenByUsername(username: string): Promise<string> {
        try {
            if (!username)
                return null;
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
            const result = await UsersCollection.findOne({ username: username }, { _id: 0, jsonToken: 1 });
            return result.jsonToken;
        } catch (error) {
            return null;
        }
    }
}