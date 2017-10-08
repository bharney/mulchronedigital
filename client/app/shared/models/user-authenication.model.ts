export interface IUser {
  email: string;
  password: string;
}

export class RegisterUser implements IUser {
  public username;
  public password;
  public email;

  constructor(username, password, email) {
    this.username = username;
    this.password = password;
    this.email = email;
  }
}


export class LoginUser implements IUser {
  public email;
  public password;

  constructor(password, email) {
    this.password = password;
    this.email = email;
  }
}

export interface IUserRegisterResponse {
  status: boolean;
  message: string;
}

export interface ILoginUserResponse {
  status: boolean;
  message: string;
  token: string;
}
