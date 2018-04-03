export class UserIpAddress {
  public ipAddress: string;
  public isApproved: boolean;
  public latitude: number;
  public longitude: number;
  public userAgent: string;
  public domain: string;

  constructor(ip: string, userAgent: string, domain: string, latitude?: number, longitude?: number) {
    this.ipAddress = ip;
    this.userAgent = userAgent;
    this.domain = domain;
    this.isApproved = false;
    if (latitude) {
      this.latitude = latitude;
    }
    if (longitude) {
      this.longitude = longitude;
    }
  }
}
