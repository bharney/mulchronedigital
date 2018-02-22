import { Injectable, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

@Injectable()
export class GoogleAnalytics {

    constructor(private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                (<any>window).ga("set", "page", event.urlAfterRedirects);
                (<any>window).ga("send", "pageview");
            }
        });
    }
}
