import { RequestHeaders } from "../http/RequestHeaders";
import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Dashboard } from "../models/dashboard.model";
import "rxjs/add/operator/map";

@Injectable()
export class DashboardService {

  constructor(
    private http: Http,
    private requestHeaders: RequestHeaders
  ) { }

  getUserInformation(): Observable<any> {
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
}
