export class UserIpAddress {
  public ipAddress: string;
  public isApproved: boolean;

  constructor(ip: string) {
    this.ipAddress = ip;
    this.isApproved = false;
  }
}
