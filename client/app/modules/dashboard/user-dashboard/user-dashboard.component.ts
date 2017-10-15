import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Dashboard } from "../../../shared/models/dashboard.model";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { JsonWebToken } from "../../../../../shared/interfaces/IJsonWebToken";
import { UserDashboardService } from "../../../shared/services/user-dashboard.service";

@Component({
  selector: "app-users-dashboard",
  styleUrls: ["./user-dashboard.component.css"],
  templateUrl: "user-dashboard.component.html",
  providers: [UserDashboardService]
})

export class UserDashboardComponent implements OnInit {
  public username: string;
  public userImage;

  constructor(
    private userDashboardService: UserDashboardService,
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
    this.userDashboardService.getUserInformation().subscribe(response => {
      if (response.status) {
        this.username = response.username;
      }
    }, (error) => {
      // TODO: some kind of error modal if some information wasn't able to be loaded.
    });
  }
}
