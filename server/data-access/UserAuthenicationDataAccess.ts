import { User } from "../models/User";
import { DataAccessObjects } from "./objects/DataAccessObjects";
import { UsersCollection, usersCollectionIsFalsy, forgotPasswordCollectionIsFalsy } from "../config/master";
import { DataAccess } from "../data-access/classes/DataAccess";
import { ForgotPasswordCollection } from "../config/master";
import { ForgotPasswordToken } from "../models/ForgotPasswordToken";
import { UserIpAddress } from "../routes/classes/UserIpAddress";
import errorLogger from "../logging/ErrorLogger";

export class UserAuthenicationDataAccess extends DataAccess {

    public static async userForgotPasswordFindUserByEmail(email: string): Promise<User[]> {
        try {
            const query = await DataAccessObjects.findUserByEmailAndIsActiveQuery(email);
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

    public static async insertForgotPasswordToken(token: ForgotPasswordToken): Promise<string> {
        try {
            if (!ForgotPasswordCollection) {
                await forgotPasswordCollectionIsFalsy();
            }
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
            if (!ForgotPasswordCollection) {
                await forgotPasswordCollectionIsFalsy();
            }
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
            if (!ForgotPasswordCollection) {
                await forgotPasswordCollectionIsFalsy();
            }
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
            if (!ForgotPasswordCollection) {
                await forgotPasswordCollectionIsFalsy();
            }
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
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
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
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
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
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
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
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
            await UsersCollection.findOneAndUpdate(query, projection, newObject);
        } catch (error) {
            errorLogger.error(error);
        }
    }

    public static async findUserJsonWebTokenRefreshInformationById(userId: string): Promise<User[]> {
        try {
            const query = await DataAccessObjects.findUserByIdQuery(userId);
            const projection = await DataAccessObjects.getJsonWebTokenInformationProjection();
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
            return await UsersCollection.find(query, projection).toArray();
        } catch (error) {
            errorLogger.error(error);
        }
    }

    public static async updateUserProfileIsActive(userId: string): Promise<any> {
        try {
            const query = await DataAccessObjects.findInactiveUserAccountByIdQuery(userId);
            const projection = await DataAccessObjects.updateUserProfileToActiveProjection();
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
            return await UsersCollection.findOneAndUpdate(query, projection);
        } catch (error) {
            errorLogger.error(error);
        }
    }

    public static async insertNewUser(newUser: User): Promise<any> {
        try {
            if (!UsersCollection) {
                await usersCollectionIsFalsy();
            }
            return await UsersCollection.insertOne(newUser);
        } catch (error) {
            errorLogger.error(error);
        }
    }
}
