import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { ILoginUser, IRegisterUser } from "../models/user-authenication.model";
import { AuthenicationControl } from "../globals/AuthenicationControl";

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
    private auth: AuthenicationControl
  ) { }

  getList(): Observable<IRegisterUser[]> {
    return this.http.get("/api/userauth/register").map(res => res.json() as IRegisterUser[]);
  }
}
