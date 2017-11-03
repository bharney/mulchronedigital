import { ApiRequests } from "../http/ApiRequests";
import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Dashboard, UserChangePassword, UserChangeUsername } from "../models/dashboard.model";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";


// TODO: Make all of these calls into seperate injectables.
@Injectable()
export class UserDashboardService {

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

  // TODO: create observable type
  public changeUserPassword(changePasswordObj: UserChangePassword): Observable<any> {
    const options: RequestOptions = this.apiRequests.createAuthorizationHeader();
    return this.http.patch("/api/userdashboard/changepassword", changePasswordObj, options)
      .map(this.apiRequests.parseResponse)
      .catch(this.apiRequests.errorCatcher);
  }

  // TODO: create observable type
  public changeUsername(changeUsernameObj: UserChangeUsername): Observable<any> {
    const options: RequestOptions = this.apiRequests.createAuthorizationHeader();
    return this.http.patch("/api/userdashboard/changeusername", changeUsernameObj, options)
      .map(this.apiRequests.parseResponse)
      .catch(this.apiRequests.errorCatcher);
  }
}
