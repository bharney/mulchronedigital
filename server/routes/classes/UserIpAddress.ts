export class UserIpAddress {
  public ipAddress: string;
  public isApproved: boolean;
  public latitude: number;
  public longitude: number;

  constructor(ip: string) {
    this.ipAddress = ip;
    this.isApproved = false;
  }
}
