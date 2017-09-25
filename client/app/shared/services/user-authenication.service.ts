import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { LoginUser, RegisterUser, IUserRegisterResponse, ILoginUserResponse } from "../models/user-authenication.model";
import { AuthenicationControl } from "../globals/AuthenicationControl";

@Injectable()
export class LoginService {

  constructor(
    private http: Http,
    private authControl: AuthenicationControl
  ) { }

  public loginUser(user: LoginUser): Observable<ILoginUserResponse> {
    return this.http.get(`/api/userauth/loginuser/${user.email}/${user.password}`).map((res: Response) => {
      return res.json();
    });
  }
}

@Injectable()
export class RegisterService {

  constructor(
    private http: Http,
    private authControl: AuthenicationControl
  ) { }

  public registerNewUser(user: RegisterUser): Observable<IUserRegisterResponse>  {
    const options = this.authControl.createRequestOptionsWithApplicationJsonHeaders();
    return this.http.post("/api/userauth/registeruser", user, options)
        .map((res: Response) => {
          return res.json();
        });
        // .map(this.extractRegisterUserData)
        // .catch(this.handleError);
  }
}
