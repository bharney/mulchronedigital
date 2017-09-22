import bcrypt = require("bcryptjs");

export class User {
  public name;
  public password;

  constructor(name: string, password: string, isNewUser: boolean) {
    this.name = name;
    this.password = password;
  }

  public HashPassword(): Promise<string> {
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
