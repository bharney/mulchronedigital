import { Injectable } from "@angular/core";
import { Headers, RequestOptions } from "@angular/http";
import * as jwtDecode from "jwt-decode";
import { JsonWebToken } from "../../../../shared/interfaces/IJsonWebToken";

@Injectable()
export class AuthenicationControl {

  public storeJsonWebToken(jsonWebToken: string): void {
    localStorage.setItem("authenication-token", jsonWebToken);
  }

  public getJsonWebTokenFromLocalStorage(): string {
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
    if (storageToken === null) {
      return null;
    }
    const decodedToken = jwtDecode(storageToken);
    const token = new JsonWebToken(decodedToken["id"], decodedToken["isAdmin"], decodedToken["iat"], decodedToken["exp"]);
    return token;
  }
}
