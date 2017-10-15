
import { Component, OnInit } from "@angular/core";
import { AuthenicationControl } from "../../shared/authenication/AuthenicationControl";
import { Router } from "@angular/router";
import { JsonWebToken } from "../../../../shared/interfaces/IJsonWebToken";

@Component({
  selector: "app-navbar-top",
  templateUrl: "./navbar-top.component.html",
  styleUrls: ["./navbar-top.component.css"],
  providers: []
})

export class NavbarTopComponent implements OnInit {

  constructor(
    public authControl: AuthenicationControl,
    private router: Router
  ) { }

  ngOnInit() {

  }

  public toggleNavigateToUserDashboardClick(): void {
    const token: JsonWebToken = this.authControl.getDecodedToken();
    if (token !== null) {
      this.router.navigate(["/dashboard/user/home/:", {id: token.id}]);
    }
  }

  public toggleLogOutUser(): void {
    this.authControl.removeJsonWebToken();
    this.router.navigate([""]);
  }

}
