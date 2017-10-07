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

export class JsonWebToken implements IJsonWebToken {
  public id;
  public isAdmin;
  public iat;
  public exp;

  constructor(id: string, isAdmin: string, iat: number, exp: number) {
    this.id = id;
    this.isAdmin = isAdmin;
    this.iat = iat;
    this.exp = exp;
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

export interface IJsonWebToken {
  id: string;
  isAdmin: false;
  iat: number;
  exp: number;
}
