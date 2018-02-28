import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { ApiRequests } from "../../../shared/http/ApiRequests";
import { AESEncryptionResult } from "../../../../../shared/Encryption";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class ForgotPasswordService {

    constructor(
        private http: Http,
        private apiRequests: ApiRequests,
    ) { }

    public resetUserPassword(encryptedResetPasswordObject: AESEncryptionResult): Observable<any> {
        const options = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
        return this.http.patch("/api/userauth/forgotpassword", encryptedResetPasswordObject, options)
        .map(this.apiRequests.parseResponse)
        .catch(this.apiRequests.errorCatcher);
    }
}
