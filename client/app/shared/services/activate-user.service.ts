import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { ApiRequests } from "../http/ApiRequests";
import { Observable } from "rxjs/Observable";
import { ActivateUser } from "../models/user-authenication.model";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class ActivateUserService {

    constructor(
        private http: Http,
        private apiRequests: ApiRequests,
    ) { }

    public makeUserActive(userObject: ActivateUser) {
        const headers = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
        return this.http.patch("/api/userauth/activateuser", userObject, headers)
        .map(this.apiRequests.parseResponse)
        .catch(this.apiRequests.errorCatcher);
    }

}