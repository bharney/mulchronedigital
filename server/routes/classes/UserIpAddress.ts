export class UserIpAddress {
  public ipAddress: string;
  public isApproved: boolean;
  public latitude: number;
  public longitude: number;
  public userAgent: string;

  constructor(ip: string, userAgent: string) {
    this.ipAddress = ip;
    this.userAgent = userAgent;
    this.isApproved = false;
  }
}
