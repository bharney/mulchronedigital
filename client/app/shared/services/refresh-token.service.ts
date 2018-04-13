import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { ApiRequests } from "../http/ApiRequests";
import { Observable } from "rxjs/Observable";
import IService from "./interfaces/IService";

@Injectable()
export class RefreshTokenService implements IService {
  public codesToNotRetry: number[] = [401];

  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
  ) { }

  public refreshToken(): Observable<any> {
    const options = this.apiRequests.createAuthorizationHeader();
    return this.http.get("/api/userauth/refreshtoken", options)
      .map(this.apiRequests.parseResponse)
      .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
      .catch(this.apiRequests.errorCatcher);
  }
}
