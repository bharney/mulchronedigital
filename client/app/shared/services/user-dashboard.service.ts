import { RequestHeaders } from "../http/RequestHeaders";
import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Dashboard, UserChangePassword, UserChangeUsername } from "../models/dashboard.model";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

@Injectable()
export class UserDashboardService {

  constructor(
    private http: Http,
    private requestHeaders: RequestHeaders,
    private authenicationControl: AuthenicationControl
  ) { }

  // TODO: create Observable type
  public getUserInformation(): Observable<any> {
    const options: RequestOptions = this.requestHeaders.createAuthorizationHeader();
    return this.http.get("/api/userdashboard/getuserinformation", options)
      .map((res: Response) => {
        return res.json();
      })
      .catch((error) => {
        const errorResponse = error.json();
        if (errorResponse.relogin) {
          this.authenicationControl.removeJsonWebToken();
        }
        return Observable.throw(errorResponse);
      });
  }

  // TODO: create observable type
  public changeUserPassword(changePasswordObj: UserChangePassword): Observable<any> {
    const options: RequestOptions = this.requestHeaders.createAuthorizationHeader();
    return this.http.put("/api/userdashboard/changepassword", changePasswordObj, options)
      .map((res: Response) => {
        return res.json();
      })
      .catch((error) => {
        const errorResponse = error.json();
        if (errorResponse.relogin) {
          this.authenicationControl.removeJsonWebToken();
        }
        return Observable.throw(errorResponse);
      });
  }

  public changeUsername(changeUsernameObj: UserChangeUsername): Observable<any> {
    const options: RequestOptions = this.requestHeaders.createAuthorizationHeader();
    return this.http.put("/api/userdashboard/changeusername", changeUsernameObj, options)
      .map((res: Response) => {
        return res.json();
      })
      .catch((error) => {
        const errorResponse = error.json();
        if (errorResponse.relogin) {
          this.authenicationControl.removeJsonWebToken();
        }
        return Observable.throw(errorResponse);
      });
  }
}
