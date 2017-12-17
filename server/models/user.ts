import bcrypt = require("bcryptjs");
import { UserIpAddress } from "../routes/classes/UserIpAddress";

export class User {
  public _id?: string;
  public isActive: boolean;
  public rememberMe: boolean;
  public username: string;
  public email: string;
  public password: string;
  public isAdmin: boolean;
  public createdAt: Date;
  public modifiedAt: Date;
  public profileImage: ProfileImage;
  public jsonToken: string;
  public ipAddresses: UserIpAddress[];

  constructor(username: string, email?: string, password?: string, ipAddress?: UserIpAddress, rememberMe?: boolean) {
    this.isActive = false;
    (rememberMe) ? this.rememberMe = true : this.rememberMe = false;
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
    this.profileImage = new ProfileImage();
    this.modifiedAt = new Date();
    this.ipAddresses = [];
    if (ipAddress) {
      this.ipAddresses.push(ipAddress);
    }
  }
  
  public async SetupNewUser(): Promise<boolean> {
    try {
      this.createdAt = new Date();
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
      this.modifiedAt = new Date();
      return true;
    } catch (error) {
      // TODO: error handling? Logging?
      return false;
    }
  }

  // TODO: through this in a helper class or something
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

class ProfileImage {
  public public_id: string;
  public version: number;
  public signature: string;
  public width: number;
  public height: number;
  public format: string;
  public resource_type: string;
  public created_at: string;
  public tags: string[];
  public bytes: number;
  public type: string;
  public etag: string;
  public placeholder: boolean;
  public url: string;
  public secure_url: string;
  public original_filename: string;
}
