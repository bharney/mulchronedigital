import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthenicationControl } from "./AuthenicationControl";

@Injectable()
export class AdminAuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authenicationControl: AuthenicationControl
    ) { }

    public canActivate(): boolean {
        if (this.authenicationControl.isUserAdmin()) {
            return true;
        } else {
            this.authenicationControl.removeJsonWebToken();
            this.router.navigate(["/users/login"]);
            return false;
        }
    }
}
