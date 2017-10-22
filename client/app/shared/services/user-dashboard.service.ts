import { RequestHeaders } from "../http/RequestHeaders";
import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Dashboard, UserChangePassword } from "../models/dashboard.model";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class UserDashboardService {

  constructor(
    private http: Http,
    private requestHeaders: RequestHeaders
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
        return Observable.throw(errorResponse);
      });
  }
}
