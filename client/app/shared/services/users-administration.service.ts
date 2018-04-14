import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { ApiRequests } from "../http/ApiRequests";
import { AuthenicationControl } from "../authenication/AuthenicationControl";
import IService from "./interfaces/IService";
import { AESEncryptionResult } from "../../../../shared/AESEncryptionResult";

@Injectable()
export class UsersAdminstrationService implements IService {
    public codesToNotRetry: number[] = [401];

    constructor(
        private http: Http,
        private apiRequests: ApiRequests,
    ) { }

    public getUsersInformation(): Observable<any> {
        const options = this.apiRequests.createAuthorizationHeader();
        return this.http.get("/api/admindashboard/getusers", options)
            .map(this.apiRequests.parseResponse)
            .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
            .catch(this.apiRequests.errorCatcher);
    }

    public deactiveUserAccount(encryptedDataToSend: AESEncryptionResult): Observable<any> {
        const options = this.apiRequests.createAuthorizationHeader();
        return this.http.patch("/api/admindashboard/deactivateuser", encryptedDataToSend, options)
            .map(this.apiRequests.parseResponse)
            .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
            .catch(this.apiRequests.errorCatcher);
    }

    public activateUserAccount(encryptedDataToSend: AESEncryptionResult): Observable<any> {
        const options = this.apiRequests.createAuthorizationHeader();
        return this.http.patch("/api/admindashboard/activateuser", encryptedDataToSend, options)
            .map(this.apiRequests.parseResponse)
            .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
            .catch(this.apiRequests.errorCatcher);
    }

    public makeUserAdmin(encryptedDataToSend: AESEncryptionResult): Observable<any> {
        const options = this.apiRequests.createAuthorizationHeader();
        return this.http.patch("/api/admindashboard/makeuseradmin", encryptedDataToSend, options)
            .map(this.apiRequests.parseResponse)
            .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
            .catch(this.apiRequests.errorCatcher);
    }

    public revokeUserAdminAccess(encryptedDataToSend: AESEncryptionResult): Observable<any> {
        const options = this.apiRequests.createAuthorizationHeader();
        return this.http.patch("/api/admindashboard/revokeuseradminaccess", encryptedDataToSend, options)
            .map(this.apiRequests.parseResponse)
            .retryWhen((error) => this.apiRequests.checkStatusCodeForRetry(this.codesToNotRetry, error))
            .catch(this.apiRequests.errorCatcher);
    }
}
