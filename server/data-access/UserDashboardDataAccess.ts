import { DataAccess } from "./classes/DataAccess";
import { DataAccessObjects } from "./objects/DataAccessObjects";
import { UsersCollection, usersCollectionIsFalsy } from "../config/master";
import { User } from "../models/User";
import errorLogger from "../logging/ErrorLogger";

export class UserDashboardDataAccess extends DataAccess {
  public static async getUserDashboardInformation(userId: string): Promise<User[]> {
    try {
      const query = await DataAccessObjects.findUserByIdQuery(userId);
      const projection = await DataAccessObjects.usernameAndProfileImageProjection();
      // TODO: why does this have to be to return as an array?
      // return only the username for the time being, omit the userid
      if (!UsersCollection) {
        await usersCollectionIsFalsy();
      }
      return await UsersCollection.find(query, projection).toArray();
    } catch (error) {
      errorLogger.error(error);
      return [];
    }
  }

  public static async findUserPasswordAndUsernameById(userId: string): Promise<User[]> {
    try {
      const query = await DataAccessObjects.findUserByIdQuery(userId);
      const projection = await DataAccessObjects.userPasswordAndUsernameProjection();
      if (!UsersCollection) {
        await usersCollectionIsFalsy();
      }
      return await UsersCollection.find(query, projection).toArray();
    } catch (error) {
      errorLogger.error(error);
      return [];
    }
  }

  public static async modifiyUsernameByUserId(userId: string, user: User): Promise<any> {
    try {
      const query = await DataAccessObjects.findUserByIdQuery(userId);
      const projection = await DataAccessObjects.changeUsernameProjection(user);
      if (!UsersCollection) {
        await usersCollectionIsFalsy();
      }
      return UsersCollection.updateOne(query, projection);
    } catch (error) {
      errorLogger.error(error);
    }
  }

  public static async getUserProfileImageInformationByUserId(userId: string): Promise<User> {
    try {
      const query = await DataAccessObjects.findUserByIdQuery(userId);
      const projection = await DataAccessObjects.getProfileImageProjection();
      if (!UsersCollection) {
        await usersCollectionIsFalsy();
      }
      return UsersCollection.findOne(query, projection);
    } catch (error) {
      errorLogger.error(error);
    }
  }

  public static async updateUserLocationForIpAddress(userId: string, ip: string, domain: string, latitude: number, longitude: number, userAgent: string): Promise<any> {
    try {
      const query = await DataAccessObjects.findUserByIdQueryMatchingIpAndDomain(userId, ip, domain);
      const projection = await DataAccessObjects.updateIpAddressLatitudeLongitudeAndUserAgent(latitude, longitude, userAgent);
      if (!UsersCollection) {
        await usersCollectionIsFalsy();
      }
      return await UsersCollection.updateOne(query, projection);
    } catch (error) {
      errorLogger.error(error);
    }
  }

  public static async updateUserProfileImage(userId: string, image: object): Promise<any> {
    try {
      const query = await DataAccessObjects.findUserByIdQuery(userId);
      const projection = await DataAccessObjects.updateUserProfileImageProjection(image);
      if (!UsersCollection) {
        await usersCollectionIsFalsy();
      }
      return await UsersCollection.findOneAndUpdate(query, projection);
    } catch (error) {
      errorLogger.error(error);
    }
  }
}
