import { ActivatedRoute, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Headers, RequestOptions } from "@angular/http";
import { JsonWebToken } from "../../../../shared/interfaces/IJsonWebToken";
import * as jwt from "jsonwebtoken";

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
    } else {
      return true;
    }
  }

  public isUserAdmin(): boolean {
    const token = this.getDecodedToken();
    if (token === null || !token.isAdmin) {
      return false;
    }
    return true;
  }

  public getDecodedToken() {
    const storageToken = this.getJsonWebTokenFromLocalStorage();
    if (storageToken === null) {
      return null;
    }
    const decodedToken = jwt.decode(storageToken);
    const token = new JsonWebToken(decodedToken["id"], decodedToken["isAdmin"], decodedToken["iat"], decodedToken["exp"], decodedToken["publicKeyPairOne"], decodedToken["privateKeyPairTwo"]);
    return token;
  }

  public dashboardInitCompareParamIdWithTokenId(acivatedRoute: ActivatedRoute, router: Router, token: any): void {
    acivatedRoute.params.subscribe(params => {
      if (params["id"] === undefined) {
        router.navigate(["../../users/login"]);
        return;
      }
      if (token === null) {
        router.navigate(["/../../users/login"]);
        return;
      }
      if (params["id"] !== token.id) {
        router.navigate(["/../../users/login"]);
        return;
      }
    });
  }
}
