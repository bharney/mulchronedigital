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
  providers: []
})

export class UserDashboardComponent implements OnInit {
  public id: string;
  public username: string;
  public userImage;
  private parentRouter: Router;

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
    this.parentRouter = this.router;
    this.route.params.subscribe(params => {
      if (params["id"] === null) {
        this.router.navigate(["../../user/uhoh"]);
        return;
      }
      const userIdParam: string = params["id"];
      const token: JsonWebToken = this.authControl.getDecodedToken();
      if (token === null) {
        this.router.navigate(["/../../user/uhoh"]);
        return;
      }
      this.id = token.id;
      this.getUserDashboardInformation();
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

  public navigateDashboad(event) {
    switch (event.target.id) {
      case "change-password-navlink":
        this.router.navigate([`../../dashboard/user`, { id: this.id }, { outlets: { "dashboard": ["changepassword"] } }]);
        break;
      case "change-username-navlink":
        this.router.navigate([`../../dashboard/user`, { id: this.id }, { outlets: { "dashboard": ["changeusername"] } }]);
        break;
      case "change-profile-picture-navlink":
        this.router.navigate(["../../dashboard/user", { id: this.id }, { outlets: { "dashboard": ["profilepicture"] } }]);
        break;
      default:
        break;
    }
  }
}
