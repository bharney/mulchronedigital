import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { ApiRequests } from "../http/ApiRequests";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class RefreshTokenService {

  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
  ) { }

  public refreshToken(): Observable<any> {
    const options = this.apiRequests.createAuthorizationHeader();
    return this.http.get("/api/userauth/refreshtoken", options)
      .map(this.apiRequests.parseResponse)
      .catch(this.apiRequests.errorCatcher);
  }
}
