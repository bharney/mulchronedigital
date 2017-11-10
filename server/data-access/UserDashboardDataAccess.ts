import { DataAccessObjects } from "./objects/DataAccessObjects";
import { UsersCollection } from "../cluster/master";
import { User } from "../models/user";

export class UserDashboardDataAccess {
  private dataAccessObjects = new DataAccessObjects();

  public async getUserDashboardInformation(userId: string): Promise<User[]> {
    let usersArray: User[] = [];
    try {
      const query = await this.dataAccessObjects.findUserByIdQuery(userId);
      const projection = await this.dataAccessObjects.usernameAndProfileImageProjection();
      // TODO: why does this have to be to return as an array?
      // return only the username for the time being, omit the userid
      usersArray = await UsersCollection.find(query, projection).toArray();
      return usersArray;
    } catch (error) {
      // TODO: log error
      return usersArray;
    }
  }
}
