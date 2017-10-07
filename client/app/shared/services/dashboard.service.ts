import { RequestHeaders } from "../http/RequestHeaders";
import { Injectable } from "@angular/core";
import { Http, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Dashboard } from "../models/dashboard.model";

@Injectable()
export class DashboardService {

  constructor(
    private http: Http,
    private requestHeaders: RequestHeaders
  ) { }

  getUserInformation(): Observable<Dashboard[]> {
    const options: RequestOptions = this.requestHeaders.createAuthorizationHeader();
    return this.http.get("/api/list", options).map(res => res.json() as Dashboard[]);
  }
}
