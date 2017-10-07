import { Injectable } from "@angular/core";
import { Headers, RequestOptions } from "@angular/http";
import { AuthenicationControl } from "../authenication/AuthenicationControl";

@Injectable()
export class RequestHeaders {

    public createAuthorizationHeader(): RequestOptions {
      const authControl: AuthenicationControl = new AuthenicationControl();
      if (!authControl.isTheUserAuthenicated) {
        return;
      } else {
        const options = this.createRequestOptionsWithApplicationJsonHeaders();
        const token = authControl.getJsonWebTokenFromLocalStorage();
        options.headers.set("User-Authenication-Token", token);
        return options;
      }
    }

    public createRequestOptionsWithApplicationJsonHeaders(): RequestOptions {
      const headers = new Headers({ "Content-Type": "application/json" });
      const requestOptions = new RequestOptions({ headers: headers });
      return requestOptions;
    }
}
