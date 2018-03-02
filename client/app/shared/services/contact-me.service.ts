import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { ApiRequests } from "../http/ApiRequests";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
import { AESEncryptionResult } from "../../../../shared/Encryption";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

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
