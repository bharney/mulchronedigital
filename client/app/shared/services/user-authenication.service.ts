import { AuthenicationControl } from "../globals/AuthenicationControl";
import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { ILoginUser, IRegisterUser, RegisterUser } from "../models/user-authenication.model";

@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  getList(): Observable<ILoginUser[]> {
    return this.http.get("/api/userauth/login").map(res => res.json() as ILoginUser[]);
  }
}

@Injectable()
export class RegisterService {

  constructor(
    private http: Http,
    private authControl: AuthenicationControl
  ) { }

  public registerNewUser(user: RegisterUser)  {
    const options = this.authControl.createRequestOptionsWithApplicationJsonHeaders();
    return this.http.post("/api/userauth/registeruser", user, options)
        .map((res: Response) => {
          return res.json();
        });
        // .map(this.extractRegisterUserData)
        // .catch(this.handleError);
  }
}
