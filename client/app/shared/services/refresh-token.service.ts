import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { ApiRequests } from "../http/ApiRequests";
import { Observable } from "rxjs/Observable";

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
      .retryWhen((error) => {
        return error.scan((errorCount, err) => {
          if (errorCount === 5) {
            throw err;
          }
          switch (err.status) {
            case 401:
              throw err;
            case 503:
              return errorCount + 1;
            default:
              return errorCount + 1;
          }
        }, 0);
      })
      .catch(this.apiRequests.errorCatcher);
  }
}
