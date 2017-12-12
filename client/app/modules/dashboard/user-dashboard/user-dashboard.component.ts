import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Dashboard } from "../../../shared/models/dashboard.model";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { JsonWebToken } from "../../../../../shared/interfaces/IJsonWebToken";
import { MainDashboardService } from "../../../shared/services/user-dashboard.service";
import { UserDashboardEmitter } from "../../../shared/services/emitters/user-dashboard-emitter.service";
import { UserLocation } from "../../../../../shared/interfaces/IUserLocation";

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
    private mainDashboardService: MainDashboardService,
    private authControl: AuthenicationControl,
    private route: ActivatedRoute,
    private router: Router,
    private userDashboardEmitter: UserDashboardEmitter
  ) { }

  ngOnInit() {
    this.isUserAuthorizedToBeHere();
    this.subscribeToUpdateUserInformationEmitter();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.saveUserLocationInformation(position);
      });
    }
  }

  private saveUserLocationInformation(position): void {
    const location = new UserLocation(position.coords.latitude, position.coords.longitude);
    this.mainDashboardService.updateUserLocation(location).subscribe(response => {
      // something with response?
      // i dont see a reason to display an error here.
    });
  }

  private isUserAuthorizedToBeHere(): void {
    this.parentRouter = this.router;
    const token: JsonWebToken = this.authControl.getDecodedToken();
    this.authControl.dashboardInitCompareParamIdWithTokenId(this.route, this.router, token);
    this.id = token.id;
    this.getUserDashboardInformation();
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

  private getUserDashboardInformation(): void {
    this.mainDashboardService.getUserInformation().subscribe(response => {
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
      this.router.navigate([`../../user-dashboard/user`, { id: this.id }, { outlets: { dashboard: ["changepassword"] } }]);      
      break;
      case "change-username-navlink":
        this.router.navigate([`../../user-dashboard/user`, { id: this.id }, { outlets: { "dashboard": ["changeusername"] } }]);
        break;
      case "change-profile-picture-navlink":
        this.router.navigate(["../../user-dashboard/user", { id: this.id }, { outlets: { "dashboard": ["profilepicture"] } }]);
        break;
      case "dashboard-home-navlink":
        this.router.navigate(["../../user-dashboard/user", { id: this.id }, { outlets: { "dashboard": ["home"] } }]);
        break;
      default:
        break;
    }
  }
}
