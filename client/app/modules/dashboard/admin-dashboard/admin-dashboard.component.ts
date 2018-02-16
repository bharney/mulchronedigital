import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { JsonWebToken } from "../../../../../shared/JsonWebToken";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"]
})

export class AdminDashboardComponent implements OnInit {
  private parentRouter: Router;

  constructor(
    private authControl: AuthenicationControl,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isTheUserAuthorizedToBeHere();
  }

  private isTheUserAuthorizedToBeHere() {
    this.parentRouter = this.router;
    const token: JsonWebToken = this.authControl.getDecodedToken();
    this.authControl.dashboardInitCompareParamIdWithTokenId(this.route, this.router, token);
  }
}
