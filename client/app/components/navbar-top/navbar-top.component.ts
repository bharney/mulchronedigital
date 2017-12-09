import { Component, OnInit } from "@angular/core";
import { AuthenicationControl } from "../../shared/authenication/AuthenicationControl";
import { ActivatedRoute, Router } from "@angular/router";
import { JsonWebToken } from "../../../../shared/interfaces/IJsonWebToken";
import { RefreshTokenService } from "../../shared/services/refresh-token.service";
declare const $: any;

@Component({
  selector: "app-navbar-top",
  templateUrl: "./navbar-top.component.html",
  styleUrls: ["./navbar-top.component.css"],
  providers: []
})
export class NavbarTopComponent implements OnInit {
  constructor(
    public authControl: AuthenicationControl,
    private router: Router,
    private refreshTokenService: RefreshTokenService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (this.authControl.isTheUserAuthenicated()) {
      setTimeout(() => {
        this.refreshTokenService.refreshToken().subscribe(response => {
          this.authControl.storeJsonWebToken(response.token);
        });
      }, 2500);
    } else {
      $("#disclaimer-modal").modal();
    }
  }

  public toggleNavigateToUserDashboardClick(): void {
    const token: JsonWebToken = this.authControl.getDecodedToken();
    if (token !== null) {
      this.router.navigate(["../../dashboard/user", { id: token.id }, { outlets: { dashboard: ["home"] } }]);
    }
  }

  public toggleLogOutUser(): void {
    this.authControl.removeJsonWebToken();
    this.router.navigate([""]);
  }
}
