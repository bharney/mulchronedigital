import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RegisterService } from "../../../shared/services/user-authenication.service";
import { RegisterUser } from "../../../shared/models/user-authenication.model";
import { UserAuthenicationValidator } from "../../../shared/authenication/UserAuthenicationValidators";

@Component({
  selector: "app-register",
  styleUrls: ["./register.component.css"],
  templateUrl: "register.component.html",
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {
  public userRegistrationForm: FormGroup;
  public hasTheFormBeenSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    this.createFormGroup();
  }

  private createFormGroup(): void {
    this.userRegistrationForm = this.formBuilder.group({
      username: [
        "testuser",
        [Validators.required, Validators.minLength(4), Validators.maxLength(12)]
      ],
      email: [
        "testuser@gmail.com",
        [Validators.required, UserAuthenicationValidator.emailValidation]
      ],
      password: [
        "TestPassword1!",
        [Validators.required, UserAuthenicationValidator.passwordValidation]
      ],
      confirmPassword: [
        "TestPassword1!",
        [
          Validators.required,
          UserAuthenicationValidator.confirmPasswordValidation
        ]
      ]
    });
  }

  private createRegisterUserObject(): RegisterUser {
    const username = this.userRegistrationForm.value.username;
    const password = this.userRegistrationForm.value.password;
    const email = this.userRegistrationForm.value.email;
    return new RegisterUser(username, password, email);
  }

  public toggleRegisterUser(): void {
    this.hasTheFormBeenSubmitted = true;
    if (!this.userRegistrationForm.valid) {
      return;
    } else {
      const newUser = this.createRegisterUserObject();
      this.registerService.registerNewUser(newUser).subscribe(res => {
        console.log(res);
      });
    }
  }
}
