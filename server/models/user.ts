import bcrypt = require("bcryptjs");

export class User {
  public username: string;
  public email: string;
  public password: string;
  public isAdmin: boolean;
  public createdAt: string;
  public modifiedAt: string;

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
    this.modifiedAt = new Date().toLocaleString();
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
