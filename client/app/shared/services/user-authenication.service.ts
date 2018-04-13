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
    private authenicationControl: AuthenicationControl
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
export class RegisterService {

  constructor(
    private http: Http,
    private apiRequests: ApiRequests,
    private authenicationControl: AuthenicationControl
  ) { }

  public registerNewUser(encryptedNewUserObject: AESEncryptionResult): Observable<IUserRegisterResponse> {
    const options = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
    return this.http.post("/api/userauth/registeruser", encryptedNewUserObject, options)
      .map(this.apiRequests.parseResponse)
      .retryWhen((error) => {
        return error.scan((errorCount, err) => {
          if (errorCount === 5) {
            throw err;
          }
          switch (err.status) {
            case 401:
            case 422:
            case 409:
              throw err;
            case 503:
              return errorCount + 1;
            default:
              return errorCount + 1;
          }
        }, 0);
      })
      .catch(this.apiRequests.errorCatcher);
  }
}
