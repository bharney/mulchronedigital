import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Dashboard } from "../../../shared/models/dashboard.model";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { JsonWebToken } from "../../../../../shared/interfaces/IJsonWebToken";
import { UserDashboardService } from "../../../shared/services/user-dashboard.service";
import { UserDashboardEmitter } from "../../../shared/services/emitters/user-dashboard-emitter.service";

@Component({
  selector: "app-users-dashboard",
  styleUrls: ["./user-dashboard.component.css"],
  templateUrl: "user-dashboard.component.html",
})

export class UserDashboardComponent implements OnInit {
  public id: string;
  public username: string;
  public profileImage: string;
  private parentRouter: Router;

  constructor(
    private userDashboardService: UserDashboardService,
    private authControl: AuthenicationControl,
    private route: ActivatedRoute,
    private router: Router,
    private userDashboardEmitter: UserDashboardEmitter
  ) { }

  ngOnInit() {
    this.isUserAuthorizedToBeHere();
    this.subscribeToUpdateUserInformationEmitter();
    this.subscribeToUserDashboardNaviationEmitter();
  }

  private isUserAuthorizedToBeHere(): void {
    this.parentRouter = this.router;
    this.route.params.subscribe(params => {
      if (params["id"] === null) {
        this.router.navigate(["../../users/login"]);
        return;
      }
      const userIdParam: string = params["id"];
      const token: JsonWebToken = this.authControl.getDecodedToken();
      if (token === null) {
        this.router.navigate(["/../../users/login"]);
        return;
      }
      this.id = token.id;
      this.getUserDashboardInformation();
    });
  }

  private subscribeToUpdateUserInformationEmitter(): void {
    this.userDashboardEmitter.changeEmitted$.subscribe(response => {
      switch (response.type) {
        case "Update user information on dashboard":
          this.getUserDashboardInformation();
          break;
        case "Update user dashboard navigation":
          this.navigateDashboad(response.event);
          break;
        default:
          break;
      }
    });
  }

  private subscribeToUserDashboardNaviationEmitter(): void {

  }

  private getUserDashboardInformation(): void {
    this.userDashboardService.getUserInformation().subscribe(response => {
      if (response.status) {
        this.username = response.username;
        this.profileImage = response.profileImage;
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
      case "dashboard-home-navlink":
        this.router.navigate(["../../dashboard/user", { id: this.id }, { outlets: { "dashboard": ["home"] } }]);
        break;
      default:
        break;
    }
  }
}
