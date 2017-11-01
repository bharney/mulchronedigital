export class Dashboard {
  id: number;
  name: string;
}

export interface IUserChangePasswordResponse {
  status: boolean;
  message: string;
}

export interface IUserChangePassword {
  currentPassword: string;
  newPassword: string;
}

export class UserChangePassword implements IUserChangePassword {
  public currentPassword: string;
  public newPassword: string;

  constructor(currentPass: string, newPass: string) {
    this.currentPassword = currentPass;
    this.newPassword = newPass;
  }
}

export interface IUserChangeUsernameResponse {
  status: string;
  message: string;
  username?: string;
}

export interface IUserChangeUsername {
  newUsername: string;
  password: string;
}

export class UserChangeUsername implements IUserChangeUsername {
  public newUsername: string;
  public password: string;

  constructor(newUsername: string, password: string) {
    this.newUsername = newUsername;
    this.password = password;
  }
}
