import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ActivateUser } from "../../../shared/models/user-authenication.model";
import { ActivateUserService } from "../../../shared/services/activate-user.service";

@Component({
  selector: "app-activate-user",
  templateUrl: "./activate-user.component.html",
  styleUrls: ["./activate-user.component.css"],
  providers: [ActivateUserService]
})
export class ActivateUserComponent implements OnInit {
  public isActivationProcessHappening: boolean = true;
  public username: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activateUserService: ActivateUserService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!this.validateParameters(params)) {
        this.router.navigate(["../../users/register"]);
      }
      const activateUser = new ActivateUser(params["id"], params["username"]);
      // this.activateUserService();
    });
  }

  private validateParameters(params: any): boolean {
    if (!params.hasOwnProperty("id") || !params.hasOwnProperty("username")) {
      return false;
    }
    if (params["id"] === undefined || params["username"] === undefined) {
      return false;
    }
    if (params["username"].toString().length < 4 || params["username"].toString().length > 12) {
      return false;
    }
    const hexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if (!hexRegExp.test(params["id"])) {
      return false;
    }
    return true;
  }
}