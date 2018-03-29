import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { JsonWebToken } from "../../../../../shared/JsonWebToken";
import { AdminDashboardEmitter } from "../../../shared/services/emitters/admin-dashboard-emitter.service";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"]
})

export class AdminDashboardComponent implements OnInit {
  private parentRouter: Router;
  public id: string;

  constructor(
    private authControl: AuthenicationControl,
    private router: Router,
    private route: ActivatedRoute,
    private adminDashboardEmitter: AdminDashboardEmitter
  ) { }

  ngOnInit() {
    this.isTheUserAuthorizedToBeHere();
    this.subscribeToAdminDashboardEmitter();
  }

  private isTheUserAuthorizedToBeHere() {
    this.parentRouter = this.router;
    const token: JsonWebToken = this.authControl.getDecodedToken();
    this.authControl.dashboardInitCompareParamIdWithTokenId(this.route, this.router, token);
    this.id = token.id;
  }

  private subscribeToAdminDashboardEmitter() {
    this.adminDashboardEmitter.changeEmitted$.subscribe(response => {
      switch (response.type) {
        case "Update admin dashboard navigation":
          this.adminDashboardNavigate(response.event);
          break;
      }
    });
  }

  private adminDashboardNavigate(event) {
    switch (event.target.id) {
      case "admin-dashboard-home-navlink":
        this.router.navigate(["../../admin-dashboard/user", { id: this.id }, { outlets: { admindashboard: ["home"] } }]);
        break;
      case "admin-dashboard-users-navlink":
        this.router.navigate(["../../admin-dashboard/user", { id: this.id }, { outlets: { admindashboard: ["users"] } }]);
        break;
    }
  }
}
