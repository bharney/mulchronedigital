export interface IUser {
  email: string;
  password: string;
  rememberMe?: boolean;
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
  public rememberMe;

  constructor(password, email, rememberMe) {
    this.password = password;
    this.email = email;
    this.rememberMe = rememberMe;
  }
}

export interface IActivateUser {
  id: string;
  username: string;
}

export class ActivateUser implements IActivateUser {
  public id;
  public username;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
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
