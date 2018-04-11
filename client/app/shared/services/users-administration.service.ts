import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { ApiRequests } from "../http/ApiRequests";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class UsersAdministrationService {

    constructor(
        private http: Http,
        private authControl: AuthenicationControl,
        private apiRequests: ApiRequests,
    ) { }

    public getUsersInformation(): Observable<any> {
        const options = this.apiRequests.createAuthorizationHeader();
        return this.http.get("/api/admindashboard/getusers", options)
            .map(this.apiRequests.parseResponse)
            .catch(this.apiRequests.errorCatcher);
    }
}
