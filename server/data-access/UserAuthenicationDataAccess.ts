import { User } from "../models/user";
import { DataAccessObjects } from "./objects/DataAccessObjects";
import { UsersCollection } from "../master";
import { DataAccess } from "../data-access/classes/DataAccess";
import { ForgotPasswordCollection } from "../master";
import { ForgotPasswordToken } from "../models/ForgotPasswordToken";
import { UserIpAddress } from "../routes/classes/UserIpAddress";
import errorLogger from "../logging/ErrorLogger";

export class UserAuthenicationDataAccess extends DataAccess {

    public static async userForgotPasswordFindUserByEmail(email: string): Promise<User[]> {
        try {
            const query = await DataAccessObjects.findUserByEmailAndIsActiveQuery(email);
            const projection = await DataAccessObjects.userObjectIdProjection();
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
            return [];
        }
    }

    public static async insertForgotPasswordToken(token: ForgotPasswordToken): Promise<string> {
        try {
            const insert = await ForgotPasswordCollection.insertOne(token);
            if (insert.result.ok === 1 && insert.result.n === 1) {
                const tokenId = insert.ops[0]._id;
                return tokenId;
            }
            return "";
        } catch (error) {
            errorLogger.error(error);
            return "";
        }
    }

    public static async findRecentForgotPasswordTokensByUserId(userId: string): Promise<ForgotPasswordToken[]> {
        try {
            const query = await DataAccessObjects.findRecentForgotPasswordTokenByUserId(userId);
            const projection = await DataAccessObjects.forgotPasswordTokenIdProjection();
            return await ForgotPasswordCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
            return [];
        }
    }

    public static async findForgotPasswordTokensByTokenId(tokenId: string): Promise<ForgotPasswordToken[]> {
        try {
            const query = await DataAccessObjects.findForgotPasswordTokenById(tokenId);
            const projection = await DataAccessObjects.resetPasswordTokenProjection();
            return await ForgotPasswordCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
            return [];
        }
    }

    public static async updatePasswordTokenToInvalidById(tokenId: string): Promise<any> {
        try {
            const query = await DataAccessObjects.findForgotPasswordTokenById(tokenId);
            const projection = await DataAccessObjects.makeForgotPasswordTokenInvalidProjection();
            return await ForgotPasswordCollection.updateOne(query, projection);
        } catch (error) {
            // TODO: send some retry to rabbitmq.
            errorLogger.error(error);
        }
    }

    public static async getJSONWebTokenInfoOfActiveUserByUserId(userId: string): Promise<User[]> {
        try {
            const query = await DataAccessObjects.findUserByIdQuery(userId);
            const projection = await DataAccessObjects.jsonWebTokenInfoThatIsActiveProjection();
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
            return [];
        }
    }

    public static async findIfUserExistsByEmail(userEmail: string): Promise<User[]> {
        try {
            const query = await DataAccessObjects.findUserByEmailQuery(userEmail);
            const projection = await DataAccessObjects.userObjectIdProjection();
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
            return [];
        }
    }

    public static async findMatchingIpAddressbyUserId(userId: string, ip: string): Promise<User[]> {
        try {
            const query = await DataAccessObjects.findUserByIdQuery(userId);
            const projection = await DataAccessObjects.userIpAddressMatch(ip);
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
            return [];
        }
    }

    public static async updateUserProfileIpAddresses(userId: string, ipAddressObject: UserIpAddress): Promise<any> {
        try {
            const query = await DataAccessObjects.findUserByIdQuery(userId);
            const projection = await DataAccessObjects.addIpAddressToIpAddressArray(ipAddressObject);
            const newObject = await DataAccessObjects.newDocument(true);
            await UsersCollection.findOneAndUpdate(query, projection, newObject);
        } catch (error) {
            errorLogger.error(error);
        }
    }

    public static async findUserJsonWebTokenRefreshInformationById(userId: string): Promise<User[]> {
        try {
            const query = await DataAccessObjects.findUserByIdQuery(userId);
            const projection = await DataAccessObjects.getJsonWebTokenInformationProjection();
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
        }
    }

    public static async updateUserProfileIsActive(userId: string): Promise<any> {
        try {
            const query = await DataAccessObjects.findInactiveUserAccountByIdQuery(userId);
            const projection = await DataAccessObjects.updateUserProfileToActiveProjection();
            return await UsersCollection.findOneAndUpdate(query, projection);
        } catch (error) {
            errorLogger.error(error);
        }
    }

    public static async insertNewUser(newUser: User): Promise<any> {
        try {
            return await UsersCollection.insertOne(newUser);
        } catch (error) {
            errorLogger.error(error);
        }
    }
}
