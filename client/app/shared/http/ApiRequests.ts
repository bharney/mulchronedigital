import { Injectable } from "@angular/core";
import { Headers, RequestOptions } from "@angular/http";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/throw";

@Injectable()
export class ApiRequests {

  constructor(
    private authenicationControl: AuthenicationControl
  ) { }

  public createAuthorizationHeader(): RequestOptions {
    if (!this.authenicationControl.isTheUserAuthenicated()) {
      return;
    } else {
      const options = this.createRequestOptionsWithApplicationJsonHeaders();
      const token = this.authenicationControl.getJsonWebTokenFromLocalStorage();
      options.headers.set("mulchronedigital-token", token);
      return options;
    }
  }

  public createRequestOptionsWithApplicationJsonHeaders(): RequestOptions {
    const headers = new Headers({ "Content-Type": "application/json" });
    const requestOptions = new RequestOptions({ headers: headers });
    return requestOptions;
  }

  public parseResponse(response: any): any {
    return response.json();
  }

  public errorCatcher(error: any): any {
    const errorResponse = error.json();
    if (errorResponse.relogin) {
      if (this.authenicationControl === undefined) {
        this.authenicationControl = new AuthenicationControl();
      }
      this.authenicationControl.removeJsonWebToken();
    }
    console.log(errorResponse);
    return Observable.throw(errorResponse || "Unknown server error");
  }

  public checkStatusCodeForRetry(codesToNotRetry: number[], error: any): Observable<any> {
    return error.scan((errorCount, err) => {
      if (errorCount === 5) {
        throw err;
      }
      for (let i = 0; i < codesToNotRetry.length; i++) {
          if (err.status === codesToNotRetry[i]) {
            throw err;
          }
          return errorCount + 1;
      }
    }, 0);
  }
}
