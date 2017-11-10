import { DataAccessObjects } from "./objects/DataAccessObjects";
import { UsersCollection } from "../cluster/master";
import { User } from "../models/user";

export class UserDashboardDataAccess {
  private dataAccessObjects = new DataAccessObjects();
  private usersArray: User[] = [];

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
}
