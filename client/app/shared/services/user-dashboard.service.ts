import { ApiRequests } from "../http/ApiRequests";
import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Dashboard, UserChangePassword, UserChangeUsername } from "../models/dashboard.model";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { UserLocation } from "../../../../shared/UserLocation";
import { AESEncryptionResult } from "../../../../shared/AESEncryptionResult";


// TODO: Make all of these calls into seperate injectables.
@Injectable()
export class MainDashboardService {
  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
    private authenicationControl: AuthenicationControl
  ) { }

  // TODO: create Observable type
  public getUserInformation(): Observable<any> {
    const options: RequestOptions = this.apiRequests.createAuthorizationHeader();
    return this.http.get("/api/userdashboard/getuserinformation", options)
      .map(this.apiRequests.parseResponse)
      .catch(this.apiRequests.errorCatcher);
  }

  public updateUserLocation(location: UserLocation): Observable<any> {
    const options: RequestOptions = this.apiRequests.createAuthorizationHeader();
    return this.http.patch("/api/userdashboard/updateuserlocation", location, options)
      .map(this.apiRequests.parseResponse)
      .catch(this.apiRequests.errorCatcher);
  }
}

@Injectable()
export class ChangeUserPasswordService {
  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
    private authenicationControl: AuthenicationControl
  ) { }

  // TODO: create observable type
  public changeUserPassword(encryptedChangePasswordObj: AESEncryptionResult): Observable<any> {
    const options: RequestOptions = this.apiRequests.createAuthorizationHeader();
    return this.http.patch("/api/userdashboard/changepassword", encryptedChangePasswordObj, options)
      .map(this.apiRequests.parseResponse)
      .catch(this.apiRequests.errorCatcher);
  }
}

@Injectable()
export class ChangeUsernameService {
  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
    private authenicationControl: AuthenicationControl
  ) { }

  // TODO: create observable type
  public changeUsername(encryptedUserObject: AESEncryptionResult): Observable<any> {
    const options: RequestOptions = this.apiRequests.createAuthorizationHeader();
    return this.http.patch("/api/userdashboard/changeusername", encryptedUserObject, options)
      .map(this.apiRequests.parseResponse)
      .catch(this.apiRequests.errorCatcher);
  }
}

@Injectable()
export class ChangeUserProfileImageService {

  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
    private authenicationControl: AuthenicationControl
  ) { }

  // TODO: create observable type
  public changeUserProfileImage(formData: FormData): Observable<any> {
    const options: RequestOptions = this.apiRequests.createAuthorizationHeader();
    options.headers.delete("Content-Type");
    return this.http.patch("/api/userdashboard/changeprofileimage", formData, options)
      .map(this.apiRequests.parseResponse)
      .catch(this.apiRequests.errorCatcher);
  }
}
