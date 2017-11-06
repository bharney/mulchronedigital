export interface IUserLocation {
  latitude: number;
  longitude: number;
}

export class UserLocation implements IUserLocation {
  public latitude: number;
  public longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
