import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { ApiRequests } from "../http/ApiRequests";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
import { AESEncryptionResult } from "../../../../shared/AESEncryptionResult";
import IService from "./interfaces/IService";

@Injectable()
export class ContactMeService implements IService {
    public codesToNotRetry: number[] = [422];

    constructor(
        private http: Http,
        private apiRequests: ApiRequests,
    ) { }

    public sendContactMe(encryptedContactMeObject: AESEncryptionResult): Observable<any> {
        const options = this.apiRequests.createRequestOptionsWithApplicationJsonHeaders();
        return this.http.post("/api/home/contactme", encryptedContactMeObject, options)
            .map(this.apiRequests.parseResponse)
            .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
            .catch(this.apiRequests.errorCatcher);
    }
}