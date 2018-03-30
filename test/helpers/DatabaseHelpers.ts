import { UsersCollection, UserActionsCollection } from "../../server/config/master";

export class DatabaseHelpers {
    public static async deleteUserFromDatabaseByUsername(username: string): Promise<boolean> {
        try {
            if (!username)
                return false;

            const deleteResult = await UsersCollection.deleteOne({ username: username });
            if (deleteResult.result.n === 1 && deleteResult.result.ok === 1)
                return true;

            return false;
        } catch (error) {
            return false;
        }
    }
}