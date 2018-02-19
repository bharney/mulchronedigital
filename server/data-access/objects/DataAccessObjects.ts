import { ObjectId } from "mongodb";
import { User } from "../../models/user";
import { UserIpAddress } from "../../routes/classes/UserIpAddress";

export class DataAccessObjects {
  public findUserByIdQuery(userId: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (userId === undefined) {
        reject(new Error("No user ID was provided at findUserByIdQuery(userId: string)"));
      }
      const query = { _id: new ObjectId(userId) };
      resolve(query);
    });
  }

  public findUserByIdQueryMatchingIp(userId: string, ip: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (userId === undefined) {
        reject(new Error("No user ID was provided at findUserIpAdressObject(userId: string, ip: string)"));
      }
      if (ip === undefined) {
        reject(new Error("No ip address object was provided at findUserIpAdressObject(userId: string, ip: string)"));
      }
      const query = { _id: new ObjectId(userId), ipAddresses: { $elemMatch: { ipAddress: ip } } };
      resolve(query);
    });
  }

  public findUserByUsernameQuery(userName: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (userName === undefined) {
        reject(new Error("No username was provided at find findUserByUsernameQuery(userName)"));
      }
      const query = { username: userName };
      resolve(query);
    });
  }

  public findUserByEmailQuery(userEmail: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (userEmail === undefined) {
        resolve(new Error("No email address was provided at findUserByEmailQuery(userEmail: string)"));
      }
      const query = { email: userEmail };
      reject(query);
    });
  }

  public findUserByEmailAndIsActiveQuery(email: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (email === undefined) {
        reject(new Error("No user email was proviarted at findUserByEmailQuery(email: string)"));
      }
      const query = { email: email, isActive: true };
      resolve(query);
    });
  }

  public usernameAndProfileImageProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { username: 1, "profileImage.secure_url": 1, _id: 0 };
      resolve(projection);
    });
  }

  public userObjectIdProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { _id: 1 };
      resolve(projection);
    });
  }

  public usernamePasswordAndIdProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { password: 1, _id: 1 };
      resolve(projection);
    });
  }

  public userLoginProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { _id: 1, password: 1, username: 1, isAdmin: 1, isActive: 1, publicKeyPairOne: 1, privateKeyPairTwo: 1 };
      resolve(projection);
    });
  }

  public updateUserPasswordProjection(password: string, modifiedAt: Date) {
    return new Promise((resolve, reject) => {
      if (password === undefined) {
        reject(new Error("No user modal was provided at updateUserPasswordProjection(user: User"));
      }
      if (modifiedAt === undefined) {
        reject(new Error("No modified at locale string provided at updateUserPasswordProjection(password: string, modifiedAt: string"));
      }
      const projection = { $set: { password: password, modifiedAt: modifiedAt } };
      console.log("projection:" + projection);
      resolve(projection);
    });
  }

  public findRecentForgotPasswordTokenById(userId: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (userId === undefined) {
        reject(new Error("No userId was provided at findRecentForgotPasswordTokenById(userId: ObjectId"));
      }
      const date = new Date();
      const query = { "userId": new ObjectId(userId), "validUntil": { $gte: date } };
      resolve(query);
    });
  }

  public forgotPasswordTokenIdProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { _id: 1 };
      resolve(projection);
    });
  }

  public jsonWebTokenThatIsActiveProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { jsonToken: 1, isActive: 1 };
      resolve(projection);
    });
  }

  public userIpAddressMatch(ip: string): Promise<object> {
    return new Promise(resolve => {
      const projection = { ipAddresses: { $elemMatch: { ipAddress: ip } } };
      resolve(projection);
    });
  }

  public addIpAddressToIpAddressArray(ipAddressObject: UserIpAddress): Promise<object> {
    return new Promise(resolve => {
      const projection = { $push: { "ipAddresses": ipAddressObject } };
      resolve(projection);
    });
  }

  public newDocument(newDocumentValue: boolean): Promise<object> {
    return new Promise(resolve => {
      const newDocument = { new: newDocumentValue };
      resolve(newDocument);
    });
  }

  public userPasswordAndUsernameProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { _id: 0, password: 1, username: 1 };
      resolve(projection);
    });
  }

  public changeUsernameProjection(user: User): Promise<object> {
    return new Promise(resolve => {
      const projection = { $set: { username: user.username, modifiedAt: user.modifiedAt } };
      resolve(projection);
    });
  }

  public getProfileImageProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { "_id": 1, "profileImage.secure_url": 1, "profileImage.public_id": 1 };
      resolve(projection);
    });
  }

  public updateIpAddressLatitudeAndLongitude(latitude: number, longitude: number): Promise<object> {
    return new Promise(resolve => {
      const projection = { $set: { "ipAddresses.$.latitude": latitude, "ipAddresses.$.longitude": longitude } };
      resolve(projection);
    });
  }
}
