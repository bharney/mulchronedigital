import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class RequestHeaders {

    public CreateRequestOptionsWithApplicationJsonHeaders(): RequestOptions {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const requestOptions = new RequestOptions({ headers: headers });
        return requestOptions;
    }

}
