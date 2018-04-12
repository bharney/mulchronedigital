import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { ApiRequests } from "../http/ApiRequests";
import { Observable } from "rxjs/Observable";
import { ActivateUser } from "../models/user-authenication.model";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
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
        .catch(this.apiRequests.errorCatcher);
    }

}