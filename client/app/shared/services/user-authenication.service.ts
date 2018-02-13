import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import { LoginUser, RegisterUser, IUserRegisterResponse, ILoginUserResponse } from "../models/user-authenication.model";
import { ApiRequests } from "../http/ApiRequests";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
import { AESEncryptionResult } from "../../../../shared/Encryption";

@Injectable()
export class LoginService {

  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
    private authenicationControl: AuthenicationControl
  ) { }

  public loginUser(encryptedLoginInfo: AESEncryptionResult): Observable<ILoginUserResponse> {
    // replace forward slashes with hyphens for the purposes of getting the correct information on the server by replace hyphens with forward slashes.
    const encryptedText = encryptedLoginInfo.encryptedText.replace(/\//g, "-");
    return this.http.get(`/api/userauth/loginuser/${encryptedText}/${encryptedLoginInfo.key}`)
      .map(this.apiRequests.parseResponse)
      .catch(this.apiRequests.errorCatcher);
  }
}

@Injectable()
export class RegisterService {

  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
    private authenicationControl: AuthenicationControl
  ) { }

  public registerNewUser(user: RegisterUser): Observable<IUserRegisterResponse> {
    const options = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
    return this.http.post("/api/userauth/registeruser", user, options)
      .map(this.apiRequests.parseResponse)
      .catch(this.apiRequests.errorCatcher);
  }
}
