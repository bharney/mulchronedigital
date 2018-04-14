import { ObjectId } from "mongodb";
import { User } from "../../models/User";
import { UserIpAddress } from "../../routes/classes/UserIpAddress";
import { reject } from "q";

export class DataAccessObjects {

  public static blankQuery(): Promise<object> {
    return new Promise(resolve => {
      const query = {};
      resolve(query);
    });
  }

  public static findUserByIdQuery(userId: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (!userId) {
        reject(new Error("No user ID was provided at findUserByIdQuery(userId: string)"));
      }
      const query = { _id: new ObjectId(userId) };
      resolve(query);
    });
  }

  public static userPasswordsFromThirtyDaysAgoQuery(userId: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (!userId) {
        reject(new Error("No user ID was provided at userPasswordsFromThirtyDaysAgoQuery(userId: string)"));
      }
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30)).toLocaleString();
      const actionType = "user_changed_password";
      const query = { userId: new ObjectId(userId), actionType: actionType, happenedAt: { $gte: thirtyDaysAgo } };
      resolve(query);
    });
  }

  public static findInactiveUserAccountByIdQuery(userId: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (!userId) {
        reject(new Error("No user ID was provided at findInactiveUserAccountByIdQuery(userId: string)"));
      }
      const query = { _id: new ObjectId(userId), isActive: false };
      resolve(query);
    });
  }

  public static findUserByIdQueryMatchingIpAndDomain(userId: string, ip: string, domain: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (!userId) {
        reject(new Error("No user ID was provided at findUserIpAdressObject(userId: string, ip: string)"));
      }
      if (!ip) {
        reject(new Error("No ip address object was provided at findUserIpAdressObject(userId: string, ip: string)"));
      }
      const query = { _id: new ObjectId(userId), ipAddresses: { $elemMatch: { ipAddress: ip, domain: domain } } };
      resolve(query);
    });
  }

  public static findUserByUsernameQuery(userName: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (userName === undefined) {
        reject(new Error("No username was provided at find findUserByUsernameQuery(userName)"));
      }
      const query = { username: userName };
      resolve(query);
    });
  }

  public static findUserByEmailQuery(userEmail: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (userEmail === undefined) {
        reject(new Error("No email address was provided at findUserByEmailQuery(userEmail: string)"));
      }
      const query = { email: userEmail };
      resolve(query);
    });
  }

  public static findUserByEmailAndIsActiveQuery(email: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (email === undefined) {
        reject(new Error("No user email was proviarted at findUserByEmailQuery(email: string)"));
      }
      const query = { email: email, isActive: true };
      resolve(query);
    });
  }

  public static usernameAndProfileImageProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { username: 1, "profileImage.secure_url": 1, _id: 0 };
      resolve(projection);
    });
  }

  public static userObjectIdProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { _id: 1 };
      resolve(projection);
    });
  }

  public static usernamePasswordAndIdProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { password: 1, _id: 1 };
      resolve(projection);
    });
  }

  public static userLoginProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { _id: 1, password: 1, username: 1, isAdmin: 1, isActive: 1, publicKeyPairOne: 1, privateKeyPairTwo: 1 };
      resolve(projection);
    });
  }

  public static updateUserPasswordProjection(password: string, modifiedAt: Date) {
    return new Promise((resolve, reject) => {
      if (password === undefined) {
        reject(new Error("No user modal was provided at updateUserPasswordProjection(user: User"));
      }
      if (modifiedAt === undefined) {
        reject(new Error("No modified at locale string provided at updateUserPasswordProjection(password: string, modifiedAt: string"));
      }
      const projection = { $set: { password: password, modifiedAt: modifiedAt } };
      resolve(projection);
    });
  }

  public static updateUserAdminAccessToFalseProjection(): Promise<object> {
    return new Promise(resolve => {
      const query = { $set: { isAdmin: false } };
      resolve(query);
    });
  }

  public updateUserAdminAccessToTrueProjection(): Promise<object> {
    return new Promise(resolve => {
      const query = { $set: { isAdmin: true } };
      resolve(query);
    });
  }

  public static userPasswordsFromThirtyDaysAgoProjection() {
    return new Promise(resolve => {
      const projection = { _id: 0, oldPassword: 1 };
      resolve(projection);
    });
  }

  public static findRecentForgotPasswordTokenByUserId(userId: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (userId === undefined) {
        reject(new Error("No userId was provided at findRecentForgotPasswordTokenById(userId: ObjectId"));
      }
      const query = { userId: new ObjectId(userId), validUntil: { $gte: new Date() } };
      resolve(query);
    });
  }

  public static findForgotPasswordTokenById(tokenId: string): Promise<object> {
    return new Promise((resolve, reject) => {
      if (tokenId === undefined) {
        reject(new Error("No tokenId was provided at findRecentForgotPasswordTokenById(tokenId: string)"));
      }
      const query = { _id: new ObjectId(tokenId), validUntil: { $gte: new Date() } };
      resolve(query);
    });
  }

  public static makeForgotPasswordTokenInvalidProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { $set: { "validUntil": new Date() } };
      resolve(projection);
    });
  }

  public static forgotPasswordTokenIdProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { _id: 1 };
      resolve(projection);
    });
  }

  public static resetPasswordTokenProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { _id: 0, userId: 1, ip: 1, tokenPassword: 1 };
      resolve(projection);
    });
  }

  public static jsonWebTokenInfoThatIsActiveProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { jsonToken: 1, jsonWebTokenPublicKey: 1, isActive: 1, isAdmin: 1 };
      resolve(projection);
    });
  }

  public static userIpAddressMatch(ip: string): Promise<object> {
    return new Promise(resolve => {
      const projection = { ipAddresses: { $elemMatch: { ipAddress: ip } } };
      resolve(projection);
    });
  }

  public static addIpAddressToIpAddressArray(ipAddressObject: UserIpAddress): Promise<object> {
    return new Promise(resolve => {
      const projection = { $push: { "ipAddresses": ipAddressObject } };
      resolve(projection);
    });
  }

  public static newDocument(newDocumentValue: boolean): Promise<object> {
    return new Promise(resolve => {
      const newDocument = { new: newDocumentValue };
      resolve(newDocument);
    });
  }

  public static userPasswordAndUsernameProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { _id: 0, password: 1, username: 1 };
      resolve(projection);
    });
  }

  public static changeUsernameProjection(user: User): Promise<object> {
    return new Promise(resolve => {
      const projection = { $set: { username: user.username, modifiedAt: user.modifiedAt } };
      resolve(projection);
    });
  }

  public static getProfileImageProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { "_id": 1, "profileImage.secure_url": 1, "profileImage.public_id": 1 };
      resolve(projection);
    });
  }

  public static updateIpAddressLatitudeLongitudeAndUserAgent(latitude: number, longitude: number, userAgent: string): Promise<object> {
    return new Promise(resolve => {
      const projection = { $set: { "ipAddresses.$.latitude": latitude, "ipAddresses.$.longitude": longitude, "ipAddresses.$.userAgent": userAgent } };
      resolve(projection);
    });
  }

  public static updateUserProfileImageProjection(image: object): Promise<object> {
    return new Promise(resolve => {
      const projection = { $set: { profileImage: image } };
      resolve(projection);
    });
  }

  public static getJsonWebTokenInformationProjection() {
    return new Promise(resolve => {
      const projection = { _id: 1, username: 1, isAdmin: 1, jsonToken: 1 };
      resolve(projection);
    });
  }

  public static updateUserProfileToActiveProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { $set: { isActive: true } };
      resolve(projection);
    });
  }

  public static updateUserProfileToInactiveProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { $set: { isActive: false } };
    });
  }

  public static getUsersForAdminDashboardProjection(): Promise<object> {
    return new Promise(resolve => {
      const projection = { _id: 1, username: 1, isAdmin: 1, isActive: 1, createdAt: 1 };
      resolve(projection);
    });
  }
}
