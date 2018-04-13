import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { ApiRequests } from "../http/ApiRequests";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
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
            .retryWhen((error) => {
                return error.scan((errorCount, err) => {
                    if (errorCount === 5) {
                        throw err;
                    }
                    switch (err.status) {
                        case 422:
                            throw err;
                        case 503:
                            return errorCount + 1;
                        default:
                            return errorCount + 1;
                    }
                }, 0);
            })
            .catch(this.apiRequests.errorCatcher);
    }
}
