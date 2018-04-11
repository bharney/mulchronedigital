import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { ApiRequests } from "../http/ApiRequests";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { AESEncryptionResult } from "../../../../shared/AESEncryptionResult";

@Injectable()
export class ContactMeService {

    constructor(
        private http: Http,
        private authControl: AuthenicationControl,
        private apiRequests: ApiRequests,
    ) { }

    public sendContactMe(encryptedContactMeObject: AESEncryptionResult): Observable<any> {
        const options = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
        return this.http.post("/api/home/contactme", encryptedContactMeObject, options)
            .map(this.apiRequests.parseResponse)
            .catch(this.apiRequests.errorCatcher);
    }
}
