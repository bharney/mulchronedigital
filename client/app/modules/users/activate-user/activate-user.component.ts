import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ActivateUser } from "../../../shared/models/user-authenication.model";
import { ActivateUserService } from "../../../shared/services/activate-user.service";
import { UserAuthenicationValidator } from "../../../../../shared/UserAuthenicationValidator";
import { GoogleAnalytics } from "../../../shared/services/google-analytics.service";
import { Encryption } from "../../../../../shared/Encryption";
import { AESEncryptionResult } from "../../../../../shared/AESEncryptionResult";

@Component({
  selector: "app-activate-user",
  templateUrl: "./activate-user.component.html",
  styleUrls: ["./activate-user.component.css"],
  providers: [ActivateUserService]
})
export class ActivateUserComponent implements OnInit {
  public isActivationProcessHappening: boolean = true;
  public activationSuccessful: boolean = false;
  public username: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activateUserService: ActivateUserService,
    private googleAnalytics: GoogleAnalytics
  ) { }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      if (!this.validateParameters(params)) {
        this.router.navigate(["../../users/register"]);
      }
      this.username = params["username"];
      const activateUser = new ActivateUser(params["id"]);
      const stringData = JSON.stringify(activateUser);
      const encryptedUserObject: AESEncryptionResult = await Encryption.AESEncrypt(stringData);
      this.activateUserService.makeUserActive(encryptedUserObject).subscribe(response => {
        this.isActivationProcessHappening = false;
        this.activationSuccessful = true;
      }, (error) => {
        this.isActivationProcessHappening = false;
        this.activationSuccessful = false;
      });
    });
  }

  private validateParameters(params: any): boolean {
    if (!params.hasOwnProperty("id") || !params.hasOwnProperty("username")) {
      return false;
    }
    if (params["id"] === undefined || params["username"] === undefined) {
      return false;
    }
    if (!UserAuthenicationValidator.isUserNameValid(params["username"])) {
      return false;
    }
    if (!UserAuthenicationValidator.isThisAValidMongoObjectId(params["id"])) {
      return false;
    }
    return true;
  }

  public toggleNavigateToUserLogin(): void {
    this.router.navigate(["../../users/login"]);
  }
}