import { DataAccess } from "./classes/DataAccess";
import { DataAccessObjects } from "./objects/DataAccessObjects";
import { UsersCollection } from "../cluster/master";
import { User } from "../models/user";

export class UserDashboardDataAccess extends DataAccess {
  public async getUserDashboardInformation(userId: string): Promise<User[]> {
    try {
      const query = await this.dataAccessObjects.findUserByIdQuery(userId);
      const projection = await this.dataAccessObjects.usernameAndProfileImageProjection();
      // TODO: why does this have to be to return as an array?
      // return only the username for the time being, omit the userid
      this.usersArray = await UsersCollection.find(query, projection).toArray();
      return this.usersArray;
    } catch (error) {
      // TODO: log error
      return this.usersArray;
    }
  }

  public async getUserPassword(userId: string): Promise<User[]> {
    try {
      const query = await this.dataAccessObjects.findUserByIdQuery(userId);
      const projection = await this.dataAccessObjects.usernamePasswordAndIdProjection();
      this.usersArray = await UsersCollection.find(query, projection).toArray();
      return this.usersArray;
    } catch (error) {
      // TODO: log error
      return this.usersArray;
    }
  }

  public async updateUserPassword(userId: string, user: User): Promise<any> {
    try {
      if (!await user.updateUserPassword()) {
        throw new Error("new password failed at updateUserPassword(user: User)");
      }
      const query = await this.dataAccessObjects.findUserByIdQuery(userId);
      const projection = await this.dataAccessObjects.updateUserPasswordProjection(user.password, user.modifiedAt);
      return await UsersCollection.updateOne(query, projection);
    } catch (error) {
      // TODO: log error;
      console.log(error);
    }
  }

  public async findUserLoginDetailsByEmail(userEmail: string) {
    try {
      const query = await this.dataAccessObjects.findUserByEmailAndIsActiveQuery(userEmail);
      const projection = await this.dataAccessObjects.userLoginProjection();
      return await UsersCollection.find(query, projection).toArray();
    } catch (error) {
      // TODO: log error;
      console.log(error);
    }
  }

  public async findUserPasswordAndUsernameById(userId: string): Promise<User[]> {
    try {
      const query = await this.dataAccessObjects.findUserByIdQuery(userId);
      const projection = await this.dataAccessObjects.userPasswordAndUsernameProjection();
      return await UsersCollection.find(query, projection).toArray();
    } catch (error) {
      console.log(error);
      // TODO: log it.
    }
  }

  public async modifiyUsernameByUserId(userId: string, user: User): Promise<any> {
    try {
      const query = await this.dataAccessObjects.findUserByIdQuery(userId);
      const projection = await this.dataAccessObjects.changeUsernameProjection(user);
      return UsersCollection.updateOne(query, projection);
    } catch (error) {
      console.log(error);
      // TODO: log it.
    }
  }

  public async getUserProfileImageInformationByUserId(userId: string): Promise<User> {
    try {
      const query = await this.dataAccessObjects.findUserByIdQuery(userId);
      const projection = await this.dataAccessObjects.getProfileImageProjection();
      return UsersCollection.findOne(query, projection);
    } catch (error) {
      console.log(error);
      // TODO: log it.
    }
  }

  public async updateUserLocationForIpAddress(userId: string, ip: string, latitude: number, longitude: number): Promise<any> {
    try {
      const query = await this.dataAccessObjects.findUserByIdQueryMatchingIp(userId, ip);
      const projection = await this.dataAccessObjects.updateIpAddressLatitudeAndLongitude(latitude, longitude);
      return await UsersCollection.findOneAndUpdate(query, projection);
    } catch (error) {
      console.log(error);
      // TODO: log it.
    }
  }
}
