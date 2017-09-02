import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import LoginUserModel = UserAuthenication.LoginUserModel;
import RegisterUserModel = UserAuthenication.RegisterUserModel;

namespace UserAuthenication {

  @Injectable()
  export class LoginService {

    constructor(private http: Http) { }

    getList(): Observable<LoginUserModel[]> {
      return this.http.get("/api/list").map(res => res.json() as LoginUserModel[]);
    }
  }

  @Injectable()
  export class RegisterService {

    constructor(private http: Http) { }

    getList(): Observable<RegisterUserModel[]> {
      return this.http.get("/api/list").map(res => res.json() as RegisterUserModel[]);
    }
  }

}
