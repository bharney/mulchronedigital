export class UserIpAddress {
  public ipAddress: string;
  public isApproved: boolean;
  public latitude: number;
  public longitude: number;
  public userAgent: string;

  constructor(ip: string, userAgent: string, latitude?: number, longitude?: number) {
    this.ipAddress = ip;
    this.userAgent = userAgent;
    this.isApproved = false;
    if (latitude) {
      this.latitude = latitude;
    }
    if (longitude) {
      this.longitude = longitude;
    }
  }
}
