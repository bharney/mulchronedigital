import { User } from "../models/user";
import { DataAccessObjects } from "./objects/DataAccessObjects";
import { UsersCollection } from "../cluster/master";
import { DataAccess } from "../data-access/classes/DataAccess";
import { ForgotPasswordCollection } from "../cluster/master";
import { ForgotPasswordToken } from "../models/ForgotPasswordToken";
import { ObjectId } from "mongodb";

export class UserAuthenicationDataAccess extends DataAccess {
    private passwordResetTokens: ForgotPasswordToken[];

    public async userForgotPasswordFindUserByEmail(email: string): Promise<User[]> {
        try {
            const query = await this.dataAccessObjects.findUserByEmailAndIsActiveQuery(email);
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

    public async checkForRecentForgotPasswordTokens(userId: string): Promise<ForgotPasswordToken[]> {
        try {
            const query = await this.dataAccessObjects.findRecentForgotPasswordTokenById(userId);
            const projection = await this.dataAccessObjects.forgotPasswordTokenIdProjection();
            this.passwordResetTokens = await ForgotPasswordCollection.find(query, projection).toArray();
            return this.passwordResetTokens;
        } catch (error) {
            console.log(error);
            return this.passwordResetTokens;
        }
    }

    public async getJSONWebTokenOfActiveUserByUserId(userId: string): Promise<User[]> {
        try {
            const query = await this.dataAccessObjects.findUserByIdQuery(userId);
            const projection = await this.dataAccessObjects.jsonWebTokenThatIsActiveProjection();
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            console.log(error);
            return this.usersArray;
        }
    }

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

    public async findIfUserExistsByEmail(userEmail: string): Promise<User[]> {
        try {
            const query = await this.dataAccessObjects.findUserByEmailQuery(userEmail);
            const projection = await this.dataAccessObjects.userObjectIdProjection();
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            console.log(error);
            return this.usersArray;
        }
    }

    public async findMatchingIpAddressbyUserId(userId: string, ip: string): Promise<User[]> {
        try {
            const query = await this.dataAccessObjects.findUserByIdQuery(userId);
            const projection = await this.dataAccessObjects.userIpAddressMatch(ip);
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            console.log(error);
            return this.usersArray;
        }
    }
}
