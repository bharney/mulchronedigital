import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RegisterService } from "../../../shared/services/user-authenication.service";
import { RegisterUser } from "../../../shared/models/user-authenication.model";
import { UserAuthenicationValidator } from "../../../shared/authenication/UserAuthenicationValidators";
declare const $: any;

@Component({
  selector: "app-register",
  styleUrls: ["./register.component.css"],
  templateUrl: "register.component.html",
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {
  public userRegistrationForm: FormGroup;
  public hasTheFormBeenSubmitted: boolean = false;
  public modalTitle: string = "";
  public modalBody: string = "";
  public registrationSuccessful: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private router: Router
  ) {
  }

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
    }
    const newUser = this.createRegisterUserObject();
    this.registerService.registerNewUser(newUser)
      .subscribe(res => {
        if (res.status) {
          this.registrationSuccessfulTextConfig();
          this.modalBody = res.message;
          $("#register-modal").modal();
        }
      }, error => {
        this.registrationUnSuccessfulTextConfig();
        this.modalBody = error.message;
        $("#register-modal").modal();
      });
  }

  private registrationSuccessfulTextConfig(): void {
    this.modalTitle = "Registration successful";
    this.registrationSuccessful = true;
  }

  private registrationUnSuccessfulTextConfig(): void {
    this.modalTitle = "Registration unsuccessful";
    this.registrationSuccessful = false;
  }

  public closeModalAndNavigateToLogin(): void {
    $("#register-modal").modal("hide");
    setTimeout(() => {
      this.router.navigate(["../../users/login"]);
    }, 1000);
  }
}
