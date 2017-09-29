import { Injectable } from "@angular/core";
import { Headers, RequestOptions } from "@angular/http";
import * as jwtDecode from "jwt-decode";

@Injectable()
export class AuthenicationControl {

  public storeJsonWebToken(jsonWebToken: string): void {
    localStorage.setItem("authenication-token", jsonWebToken);
  }

  public getJsonWebTokenFromSessionStorage(): string {
    return localStorage.getItem("authenication-token");
  }

  public removeJsonWebToken(): void {
    localStorage.removeItem("authenication-token");
  }

  public getDecodedToken(token: string) {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  }

  public isTheUserAuthenicated(): boolean {
    const token = this.getJsonWebTokenFromSessionStorage();
    if (token === null) {
      return false;
    } else {
      return true;
    }
  }

  public createAuthorizationHeader(): RequestOptions {
    // if the user doesnt not have a token stored stop
    if (!this.isTheUserAuthenicated) {
      return;
    } else {
      const options = new RequestOptions({ headers: new Headers() });
      const token = this.getJsonWebTokenFromSessionStorage();
      options.headers.set("x-access-token", token);
      return options;
    }
  }

  public createRequestOptionsWithApplicationJsonHeaders(): RequestOptions {
    const headers = new Headers({ "Content-Type": "application/json" });
    const requestOptions = new RequestOptions({ headers: headers });
    return requestOptions;
  }
}
