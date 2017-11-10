import { ObjectId } from "mongodb";

export class DataAccessObjects {
  public findUserByIdQuery(userId: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (userId === null) {
        reject(new Error("No user ID was provided at findUserByIdQuery(userId: string)"));
      }
      const query = { _id: new ObjectId(userId) };
      resolve(query);
    });
  }

  public usernameAndProfileImageProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { username: 1, profileImage: 1, _id: 0 };
      resolve(projection);
    });
  }
}
