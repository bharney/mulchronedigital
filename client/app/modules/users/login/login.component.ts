import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "../../../shared/services/user-authenication.service";
import { LoginUser } from "../../../shared/models/user-authenication.model";
import { UserAuthenicationValidator } from "../../../shared/authenication/UserAuthenicationValidators";
import * as jwtDecode from "jwt-decode";

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
    private formBuilder: FormBuilder
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
    } else {
      const loginUser = this.createLoginUser();
      this.loginService.loginUser(loginUser).subscribe(res => {
        console.log(res.token);
        const hello = jwtDecode(res.token);
        console.log(hello);
      });
    }
  }
}
