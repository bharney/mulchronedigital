import { DataAccessObjects } from "./objects/DataAccessObjects";
import { UsersCollection } from "../cluster/master";
import { DataAccess } from "../data-access/classes/DataAccess";
import { ForgotPasswordCollection } from "../cluster/master";
import { ForgotPasswordToken } from "../models/ForgotPasswordToken";


export class UserAuthenicationDataAccess extends DataAccess {

    public async userForgotPasswordFindUserByEmail(email: string) {
        try {
            const query = await this.dataAccessObjects.findUserByEmailQuery(email);
            const projection = await this.dataAccessObjects.userObjectIdProjection();
            this.usersArray = await UsersCollection.find(query, projection).toArray();
            return this.usersArray;
        } catch (error) {
            console.log(error);
            // TODO: log error
            return this.usersArray;
        }
    }

    public async insertForgotPasswordToken(token: ForgotPasswordToken): Promise<string> {
        try {
            const insert = await ForgotPasswordCollection.insertOne(token);
            if (insert.result.ok === 1 && insert.result.n === 1) {
                const tokenId = insert.ops[0]._id;
                return tokenId;
            }
            return "";
        } catch (error) {
            return "";
        }
    }
}
