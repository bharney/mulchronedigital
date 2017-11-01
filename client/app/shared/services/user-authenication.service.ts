import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

import { LoginUser, RegisterUser, IUserRegisterResponse, ILoginUserResponse } from "../models/user-authenication.model";
import { RequestHeaders } from "../http/RequestHeaders";
import { AuthenicationControl } from "../authenication/AuthenicationControl";

@Injectable()
export class LoginService {

  constructor(
    private http: Http,
    private authenicationControl: AuthenicationControl
  ) { }

  public loginUser(user: LoginUser): Observable<ILoginUserResponse> {
    return this.http.get(`/api/userauth/loginuser/${user.email}/${user.password}`)
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

@Injectable()
export class RegisterService {

  constructor(
    private http: Http,
    private requestHeaders: RequestHeaders,
    private authenicationControl: AuthenicationControl
  ) { }

  public registerNewUser(user: RegisterUser): Observable<IUserRegisterResponse> {
    const options = this.requestHeaders.createRequestOptionsWithApplicationJsonHeaders();
    return this.http.post("/api/userauth/registeruser", user, options)
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
