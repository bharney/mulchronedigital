import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthenicationControl } from "./AuthenicationControl";

@Injectable()
export class ClientAuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authenicationControl: AuthenicationControl
    ) { }

    public canActivate(): boolean {
        // call the authenication control module and see if the user has json web token stored.
        if (this.authenicationControl.isTheUserAuthenicated()) {
            // if they do return true to app routing module so they can access that route.
            return true;
        } else {
            // if they do not have a json webtoken in session storage redirect them to the signin in page.
            this.router.navigate(["/users/login"]);
            return false;
        }
    }
}
