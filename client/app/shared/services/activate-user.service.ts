import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { ApiRequests } from "../http/ApiRequests";
import { Observable } from "rxjs/Observable";
import { ActivateUser } from "../models/user-authenication.model";
import { AESEncryptionResult } from "../../../../shared/AESEncryptionResult";
import IService from "./interfaces/IService";

@Injectable()
export class ActivateUserService implements IService {
    public codesToNotRetry: number[] = [409, 401];

    constructor(
        private http: Http,
        private apiRequests: ApiRequests,
    ) { }

    public makeUserActive(encryptedUserObject: AESEncryptionResult) {
        const headers = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
        return this.http.patch("/api/userauth/activateuser", encryptedUserObject, headers)
            .map(this.apiRequests.parseResponse)
            .retryWhen((error) => {
                return this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error);
            })
            .catch(this.apiRequests.errorCatcher);
    }
}