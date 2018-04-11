import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { ApiRequests } from "../../../shared/http/ApiRequests";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { AESEncryptionResult } from "../../../../../shared/AESEncryptionResult";

@Injectable()
export class ForgotPasswordService {

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
