import { JsonWebToken } from "../../../shared/models/user-authenication.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../../shared/services/dashboard.service";
import { Dashboard } from "../../../shared/models/dashboard.model";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";

@Component({
  selector: "app-users-dashboard",
  styleUrls: ["./dashboard.component.css"],
  templateUrl: "dashboard.component.html",
  providers: [DashboardService]
})

export class DashboardComponent implements OnInit {

  constructor(
    private dashboardService: DashboardService,
    private authControl: AuthenicationControl,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.isUserAuthorizedToBeHere();
  }

  private isUserAuthorizedToBeHere() {
    this.route.params.subscribe(params => {
      const userIdParam: string = params["id"];
      const token: JsonWebToken = this.authControl.getDecodedToken();
      if (token.id !== userIdParam) {
        this.router.navigate(["../../users/login"]);
      }
      this.configureUserDashboard();
    });
  }

  private configureUserDashboard(): void {
    this.dashboardService.getUserInformation().subscribe(response => {

    });
  }
}
