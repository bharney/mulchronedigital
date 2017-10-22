import { Router } from "@angular/router";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "../../../shared/services/user-authenication.service";
import { ILoginUserResponse, IUserRegisterResponse, LoginUser } from "../../../shared/models/user-authenication.model";
import { JsonWebToken } from "../../../../../shared/interfaces/IJsonWebToken";
import { UserAuthenicationValidator } from "../../../../../shared/UserAuthenicationValidator";

@Component({
  selector: "app-login",
  styleUrls: ["./login.component.css"],
  templateUrl: "login.component.html",
  providers: [LoginService]
})

export class LoginComponent implements OnInit {
  public userLoginForm: FormGroup;
  public hasTheFormBeenSubmitted = false;

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private authControl: AuthenicationControl,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createFormGroup();
  }

  private createFormGroup(): void {
    this.userLoginForm = this.formBuilder.group({
      email: [
        "testuser@gmail.com",
        [Validators.required, UserAuthenicationValidator.emailValidation]
      ],
      password: [
        "TestPassword1!",
        [Validators.required, UserAuthenicationValidator.passwordValidation]
      ]
    });
  }

  private createLoginUser(): LoginUser {
    const email = this.userLoginForm.value.email;
    const password = this.userLoginForm.value.password;
    return new LoginUser(password, email);
  }

  public toggleLoginUser() {
    this.hasTheFormBeenSubmitted = true;
    if (!this.userLoginForm.valid) {
      return;
    }

    const loginUser = this.createLoginUser();
    this.loginService.loginUser(loginUser)
      .subscribe((res: ILoginUserResponse) => {
        if (res.status) {
          this.authControl.storeJsonWebToken(res.token);
          this.routerToUserDashboardOrAdminDashboard();
        }
      }, (error: IUserRegisterResponse) => {
        // TODO: display modal error
        console.log(error);
      });
  }

  private routerToUserDashboardOrAdminDashboard(): void {
    const token: JsonWebToken = this.authControl.getDecodedToken();
    if (token.isAdmin) {
      // TODO: route to admin dashboard
    } else {
      this.router.navigate([`../../dashboard/user`, { id: token.id }, { outlets: {"dashboard": ["home"]}  }]);
    }
  }
}
