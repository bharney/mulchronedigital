import { DataAccess } from "./classes/DataAccess";
import { DataAccessObjects } from "./objects/DataAccessObjects";
import { UsersCollection } from "../master";
import { User } from "../models/user";
import errorLogger from "../logging/ErrorLogger";

export class UserDashboardDataAccess extends DataAccess {
  public static async getUserDashboardInformation(userId: string): Promise<User[]> {
    try {
      const query = await DataAccessObjects.findUserByIdQuery(userId);
      const projection = await DataAccessObjects.usernameAndProfileImageProjection();
      // TODO: why does this have to be to return as an array?
      // return only the username for the time being, omit the userid
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
      return UsersCollection.updateOne(query, projection);
    } catch (error) {
      errorLogger.error(error);
    }
  }

  public static async getUserProfileImageInformationByUserId(userId: string): Promise<User> {
    try {
      const query = await DataAccessObjects.findUserByIdQuery(userId);
      const projection = await DataAccessObjects.getProfileImageProjection();
      return UsersCollection.findOne(query, projection);
    } catch (error) {
      errorLogger.error(error);
    }
  }

  public static async updateUserLocationForIpAddress(userId: string, ip: string, latitude: number, longitude: number): Promise<any> {
    try {
      const query = await DataAccessObjects.findUserByIdQueryMatchingIp(userId, ip);
      const projection = await DataAccessObjects.updateIpAddressLatitudeAndLongitude(latitude, longitude);
      return await UsersCollection.findOneAndUpdate(query, projection);
    } catch (error) {
      errorLogger.error(error);
    }
  }

  public static async updateUserProfileImage(userId: string, image: object): Promise<any> {
    try {
      const query = await DataAccessObjects.findUserByIdQuery(userId);
      const projection = await DataAccessObjects.updateUserProfileImageProjection(image);
      return await UsersCollection.findOneAndUpdate(query, projection);
    } catch (error) {
      errorLogger.error(error);
    }
  }
}
