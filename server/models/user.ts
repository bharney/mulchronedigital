import bcrypt = require("bcryptjs");
import { UserIpAddress } from "../routes/classes/UserIpAddress";

export class User {
  public _id?: string;
  public username: string;
  public email: string;
  public password: string;
  public isAdmin: boolean;
  public createdAt: string;
  public modifiedAt: string;
  public profileImage: string;
  public jsonToken: string;
  public latitude: number;
  public longitude: number;
  public ipAddresses: UserIpAddress[];

  constructor(username: string, ipAddress?: UserIpAddress, email?: string, password?: string) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
    this.modifiedAt = new Date().toLocaleString();
    if (ipAddress) {
      this.ipAddresses = [];
      this.ipAddresses.push(ipAddress);
    }
  }

  public async SetupNewUser(): Promise<boolean> {
    try {
      this.createdAt = new Date().toLocaleString();
      this.password = await this.HashPassword();
      const result = true;
      return result;
    } catch (error) {
      const result = false;
      return result;
    }
  }

  public async updateUserPassword(): Promise<boolean> {
    try {
      this.password = await this.HashPassword();
      this.modifiedAt = new Date().toLocaleString();
      return true;
    } catch (error) {
      // TODO: error handling? Logging?
      return false;
    }
  }

  private HashPassword(): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10)
        .then(salt => {
          return bcrypt.hash(this.password, salt);
        })
        .then(hashedPassword => {
          resolve(hashedPassword);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

}
