import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { JsonWebToken } from "../../../../../../../shared/JsonWebToken";
import { AuthenicationControl } from "../../../../../shared/authenication/AuthenicationControl";

@Component({
  selector: "app-admin-dashboard-navigation",
  templateUrl: "./admin-dashboard-navigation.component.html",
  styleUrls: ["./admin-dashboard-navigation.component.css"]
})
export class AdminDashboardNavigationComponent implements OnInit {
  public id: string;
  private parentRouter: Router;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authControl: AuthenicationControl
  ) { }

  ngOnInit() {

  }

  private isUserAuthorizedToBeHere(): void {
    this.parentRouter = this.router;
    const token: JsonWebToken = this.authControl.getDecodedToken();
    this.authControl.dashboardInitCompareParamIdWithTokenId(this.route, this.router, token);
    this.id = token.id;
  }

  public toggleAdminDashboardNavigation(event: any): void {
    switch (event.target.id) {
      case "admin-dashboard-home-navlink":
        this.router.navigate(["../../admin-dashboard/user", { id: this.id }, { outlets: { admindashboard: ["home"] } }]);
        break;
    }
  }
}
