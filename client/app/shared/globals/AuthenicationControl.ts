import { Injectable } from "@angular/core";
import { Headers, RequestOptions } from "@angular/http";

@Injectable()
export class AuthenicationControl {

  public storeJsonWebToken(jsonWebToken: string): void {
    localStorage.setItem("token", jsonWebToken);
  }

  public getJsonWebTokenFromSessionStorage(): string {
    return localStorage.getItem("token");
  }

  public removeJsonWebToken(): void {
    localStorage.removeItem("token");
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

  public CreateRequestOptionsWithApplicationJsonHeaders(): RequestOptions {
    const headers = new Headers({ "Content-Type": "application/json" });
    const requestOptions = new RequestOptions({ headers: headers });
    return requestOptions;
  }
}
