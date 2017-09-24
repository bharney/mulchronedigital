export interface IRegisterUser {
  username: string;
  password: string;
  email: string;
}

export class RegisterUser implements IRegisterUser {
  public username;
  public password;
  public email;

  constructor(username, password, email) {
    this.username = username;
    this.password = password;
    this.email = email;
  }
}

export interface ILoginUser {
  id: number;
  name: string;
}
