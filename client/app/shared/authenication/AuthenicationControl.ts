import { Injectable } from "@angular/core";
import { Headers, RequestOptions } from "@angular/http";
import * as jwtDecode from "jwt-decode";
import { JsonWebToken } from "../models/user-authenication.model";

@Injectable()
export class AuthenicationControl {

  public storeJsonWebToken(jsonWebToken: string): void {
    localStorage.setItem("authenication-token", jsonWebToken);
  }

  private getJsonWebTokenFromLocalStorage(): string {
    return localStorage.getItem("authenication-token");
  }

  public removeJsonWebToken(): void {
    localStorage.removeItem("authenication-token");
  }

  public isTheUserAuthenicated(): boolean {
    const token = this.getDecodedToken();
    if (token === null) {
      return false;
    } else if (new Date(token.exp) > new Date()) {
      return false;
    } else {
      return true;
    }
  }

  public getDecodedToken() {
    const storageToken = this.getJsonWebTokenFromLocalStorage();
    const decodedToken = jwtDecode(storageToken);
    const token = new JsonWebToken(decodedToken["id"], decodedToken["isAdmin"], decodedToken["iat"], decodedToken["exp"]);
    return token;
  }

  public createAuthorizationHeader(): RequestOptions {
    // if the user doesnt not have a token stored stop
    if (!this.isTheUserAuthenicated) {
      return;
    } else {
      const options = new RequestOptions({ headers: new Headers() });
      const token = this.getJsonWebTokenFromLocalStorage();
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
