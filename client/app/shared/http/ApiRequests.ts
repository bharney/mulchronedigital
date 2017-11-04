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
    const authControl: AuthenicationControl = new AuthenicationControl();
    if (!authControl.isTheUserAuthenicated) {
      return;
    } else {
      const options = this.createRequestOptionsWithApplicationJsonHeaders();
      const token = authControl.getJsonWebTokenFromLocalStorage();
      options.headers.set("user-authenication-token", token);
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
      this.authenicationControl.removeJsonWebToken();
    }
    console.log(errorResponse);
    return Observable.throw(errorResponse || "Unknown server error");
  }
}
