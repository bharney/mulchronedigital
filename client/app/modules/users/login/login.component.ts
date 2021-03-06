import { Router } from "@angular/router";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "../../../shared/services/user-authenication.service";
import { ILoginUserResponse, IUserRegisterResponse, LoginUser } from "../../../shared/models/user-authenication.model";
import { JsonWebToken } from "../../../../../shared/JsonWebToken";
import { UserAuthenicationValidator } from "../../../../../shared/UserAuthenicationValidator";
import { Encryption } from "../../../../../shared/Encryption";
import { GoogleAnalytics } from "../../../shared/services/google-analytics.service";
import { AESEncryptionResult } from "../../../../../shared/AESEncryptionResult";
declare const $: any;

@Component({
  selector: "app-login",
  styleUrls: ["./login.component.css"],
  templateUrl: "login.component.html",
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  public userLoginForm: FormGroup;
  public hasTheFormBeenSubmitted: boolean = false;
  public modalTitle: string = "";
  public modalBody: string = "";
  public hasSubmitButtonBeenClicked: boolean = false;

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private authControl: AuthenicationControl,
    private router: Router,
    private googleAnalytics: GoogleAnalytics
  ) { }

  ngOnInit(): void {
    this.createFormGroup();
  }

  private createFormGroup(): void {
    this.userLoginForm = this.formBuilder.group({
      email: [
        "",
        [Validators.required, UserAuthenicationValidator.emailValidation]
      ],
      password: [
        "",
        [Validators.required, UserAuthenicationValidator.passwordValidation]
      ]
    });
  }

  public handleDownKeyOnForm(event): void {
    if (event.keyCode === 13) {
      this.toggleLoginUser();
    }
  }

  public toggleLoginUser() {
    this.hasSubmitButtonBeenClicked = true;
    setTimeout(async () => {
      this.hasTheFormBeenSubmitted = true;
      if (!this.userLoginForm.valid) {
        this.hasSubmitButtonBeenClicked = false;
        return;
      }
      const loginUser = this.createLoginUser();
      const stringData = JSON.stringify(loginUser);
      const encryptedLoginInfo: AESEncryptionResult = await Encryption.AESEncrypt(stringData);
      this.loginService.loginUser(encryptedLoginInfo).subscribe(
        (res: ILoginUserResponse) => {
          if (res.status) {
            this.authControl.storeJsonWebToken(res.token);
            this.hasSubmitButtonBeenClicked = false;
            this.routerToUserDashboardOrAdminDashboard();
          }
        },
        (error: IUserRegisterResponse) => {
          this.loginFailure(error.message);
          this.hasSubmitButtonBeenClicked = false;
        }
      );
    }, 200);
  }

  private createLoginUser(): LoginUser {
    const email = this.userLoginForm.value.email;
    const password = this.userLoginForm.value.password;
    return new LoginUser(password, email);
  }
  private loginFailure(errorMessage: string): void {
    this.modalBody = errorMessage;
    this.modalTitle = "Login Failure";
    $("#error-modal").modal();
  }

  private routerToUserDashboardOrAdminDashboard(): void {
    const token: JsonWebToken = this.authControl.getDecodedToken();
    if (token.isAdmin) {
      // TODO: route to admin dashboard
      this.router.navigate(["../../admin-dashboard/user", { id: token.id }]);
    } else {
      this.router.navigate([`../../user-dashboard/user`, { id: token.id }, { outlets: { dashboard: ["home"] } }]);
    }
  }
}
