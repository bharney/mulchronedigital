import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ApiRequests } from "../http/ApiRequests";
import { AESEncryptionResult } from "../../../../shared/AESEncryptionResult";
import IService from "./interfaces/IService";

@Injectable()
export class ForgotPasswordService implements IService {
    public codesToNotRetry: number[] = [];

    constructor(
        private http: Http,
        private apiRequests: ApiRequests,
    ) { }

    public forgotPassword(encryptedForgotPassword: AESEncryptionResult): Observable<any> {
        const options = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
        return this.http.patch("/api/userauth/forgotpassword", encryptedForgotPassword, options)
            .map(this.apiRequests.parseResponse)
            .catch(this.apiRequests.errorCatcher);
    }

    public resetUserPassword(encryptedResetPassword: AESEncryptionResult): Observable<any> {
        const options = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
        return this.http.patch("/api/userauth/resetpassword", encryptedResetPassword, options)
            .map(this.apiRequests.parseResponse)
            .catch(this.apiRequests.errorCatcher);
    }
}
