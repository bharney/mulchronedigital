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

  constructor(currentPass, newPass) {
    this.currentPassword = currentPass;
    this.newPassword = newPass;
  }
}
