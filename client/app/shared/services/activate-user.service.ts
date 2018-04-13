import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { ApiRequests } from "../http/ApiRequests";
import { Observable } from "rxjs/Observable";
import { ActivateUser } from "../models/user-authenication.model";
import { AESEncryptionResult } from "../../../../shared/AESEncryptionResult";

@Injectable()
export class ActivateUserService {

    constructor(
        private http: Http,
        private apiRequests: ApiRequests,
    ) { }

    public makeUserActive(encryptedUserObject: AESEncryptionResult) {
        const headers = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
        return this.http.patch("/api/userauth/activateuser", encryptedUserObject, headers)
            .map(this.apiRequests.parseResponse)
            .retryWhen((error) => {
                return error.scan((errorCount, err) => {
                    if (errorCount === 5) {
                        throw err;
                    }
                    switch (err.status) {
                        case 409:
                        case 401:
                            throw err;
                        case 503:
                            return errorCount + 1;
                    }
                }, 0);
            })
            .catch(this.apiRequests.errorCatcher);
    }

}