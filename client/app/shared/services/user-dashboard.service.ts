import { ApiRequests } from "../http/ApiRequests";
import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Dashboard, UserChangePassword, UserChangeUsername } from "../models/dashboard.model";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
import { UserLocation } from "../../../../shared/UserLocation";
import { AESEncryptionResult } from "../../../../shared/AESEncryptionResult";
import IService from "./interfaces/IService";


// TODO: Make all of these calls into seperate injectables.
@Injectable()
export class MainDashboardService implements IService {
  public codesToNotRetry: number[] = [401, 409];

  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
  ) { }

  // TODO: create Observable type
  public getUserInformation(): Observable<any> {
    const options: RequestOptions = this.apiRequests.createAuthorizationHeader();
    return this.http.get("/api/userdashboard/getuserinformation", options)
      .map(this.apiRequests.parseResponse)
      .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
      .catch(this.apiRequests.errorCatcher);
  }

  public updateUserLocation(location: UserLocation): Observable<any> {
    const options: RequestOptions = this.apiRequests.createAuthorizationHeader();
    return this.http.patch("/api/userdashboard/updateuserlocation", location, options)
      .map(this.apiRequests.parseResponse)
      .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
      .catch(this.apiRequests.errorCatcher);
  }
}

@Injectable()
export class ChangeUserPasswordService implements IService {
  public codesToNotRetry: number[] = [401, 422];

  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
  ) { }

  // TODO: create observable type
  public changeUserPassword(encryptedChangePasswordObj: AESEncryptionResult): Observable<any> {
    const options: RequestOptions = this.apiRequests.createAuthorizationHeader();
    return this.http.patch("/api/userdashboard/changepassword", encryptedChangePasswordObj, options)
      .map(this.apiRequests.parseResponse)
      .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
      .catch(this.apiRequests.errorCatcher);
  }
}

@Injectable()
export class ChangeUsernameService implements IService {
  public codesToNotRetry: number[] = [401, 422, 409];

  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
  ) { }

  // TODO: create observable type
  public changeUsername(encryptedUserObject: AESEncryptionResult): Observable<any> {
    const options: RequestOptions = this.apiRequests.createAuthorizationHeader();
    return this.http.patch("/api/userdashboard/changeusername", encryptedUserObject, options)
      .map(this.apiRequests.parseResponse)
      .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
      .catch(this.apiRequests.errorCatcher);
  }
}

@Injectable()
export class ChangeUserProfileImageService implements IService {
  public codesToNotRetry: number[] = [401, 413, 415];

  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
  ) { }

  // TODO: create observable type
  public changeUserProfileImage(formData: FormData): Observable<any> {
    const options: RequestOptions = this.apiRequests.createAuthorizationHeader();
    options.headers.delete("Content-Type");
    return this.http.patch("/api/userdashboard/changeprofileimage", formData, options)
      .map(this.apiRequests.parseResponse)
      .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
      .catch(this.apiRequests.errorCatcher);
  }
}
