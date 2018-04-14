import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";

import { LoginUser, RegisterUser, IUserRegisterResponse, ILoginUserResponse } from "../models/user-authenication.model";
import { ApiRequests } from "../http/ApiRequests";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
import { AESEncryptionResult } from "../../../../shared/AESEncryptionResult";
import IService from "./interfaces/IService";

@Injectable()
export class LoginService implements IService {
  public codesToNotRetry: number[] = [401, 422];
  
  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
  ) { }

  public loginUser(encryptedLoginInfo: AESEncryptionResult): Observable<ILoginUserResponse> {
    const options = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
    return this.http.post("/api/userauth/loginuser", encryptedLoginInfo, options)
      .map(this.apiRequests.parseResponse)
      .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
      .catch(this.apiRequests.errorCatcher);
  }
}

@Injectable()
export class RegisterService implements IService {
  public codesToNotRetry: number[] = [401, 422, 409];

  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
  ) { }

  public registerNewUser(encryptedNewUserObject: AESEncryptionResult): Observable<IUserRegisterResponse> {
    const options = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
    return this.http.post("/api/userauth/registeruser", encryptedNewUserObject, options)
      .map(this.apiRequests.parseResponse)
      .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
      .catch(this.apiRequests.errorCatcher);
  }
}
