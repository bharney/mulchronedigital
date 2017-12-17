import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { ApiRequests } from "../../../shared/http/ApiRequests";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class ForgotPasswordService {

    constructor(
        private http: Http,
        private apiRequests: ApiRequests,
    ) { }

    public resetUserPassword(resetPasswordObject: any): Observable<any> {
        const options = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
        return this.http.patch("/api/userauth/forgotpassword", resetPasswordObject, options)
        .map(this.apiRequests.parseResponse)
        .catch(this.apiRequests.errorCatcher);
    }
}
