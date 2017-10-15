import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../../shared/services/dashboard.service";
import { Dashboard } from "../../../shared/models/dashboard.model";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { JsonWebToken } from "../../../../../shared/interfaces/IJsonWebToken";

@Component({
  selector: "app-users-dashboard",
  styleUrls: ["./dashboard.component.css"],
  templateUrl: "dashboard.component.html",
  providers: [DashboardService]
})

export class DashboardComponent implements OnInit {
  public username: string;
  public userImage;


  constructor(
    private dashboardService: DashboardService,
    private authControl: AuthenicationControl,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.isUserAuthorizedToBeHere();
  }

  private isUserAuthorizedToBeHere() {
    this.route.params.subscribe(params => {
      if (params["id"] !== null) {
        const userIdParam: string = params["id"];
        const token: JsonWebToken = this.authControl.getDecodedToken();
        if (token.id !== userIdParam) {
          this.router.navigate(["../../users/login"]);
        }
        this.getUserDashboardInformation();
      }
    });
  }

  private getUserDashboardInformation(): void {
    this.dashboardService.getUserInformation().subscribe(response => {
      if (response.status) {
        this.username = response.username;
      }
    }, (error) => {

    });
  }
}
