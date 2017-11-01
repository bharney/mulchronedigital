import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

import { LoginUser, RegisterUser, IUserRegisterResponse, ILoginUserResponse } from "../models/user-authenication.model";
import { RequestHeaders } from "../http/RequestHeaders";

@Injectable()
export class LoginService {

  constructor(
    private http: Http,
  ) { }

  public loginUser(user: LoginUser): Observable<ILoginUserResponse> {
    return this.http.get(`/api/userauth/loginuser/${user.email}/${user.password}`)
    .map((res: Response) => {
      return res.json();
    })
    .catch((error) => {
      const errorResponse = error.json();
      return Observable.throw(errorResponse);
    });
  }
}

@Injectable()
export class RegisterService {

  constructor(
    private http: Http,
    private requestHeaders: RequestHeaders
  ) { }

  public registerNewUser(user: RegisterUser): Observable<IUserRegisterResponse> {
    const options = this.requestHeaders.createRequestOptionsWithApplicationJsonHeaders();
    return this.http.post("/api/userauth/registeruser", user, options)
      .map((res: Response) => {
        return res.json();
      })
      .catch((error) => {
        const errorResponse = error.json();
        return Observable.throw(errorResponse);
      });
  }
}
