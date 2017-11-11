import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RegisterService } from "../../../shared/services/user-authenication.service";
import { RegisterUser, IUserRegisterResponse } from "../../../shared/models/user-authenication.model";
import { UserAuthenicationValidator } from "../../../../../shared/UserAuthenicationValidator";
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
  public hasSubmitButtonBeenClicked: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private router: Router
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

  public handleDownKeyOnForm(event): void {
    if (event.keyCode === 13) {
      this.toggleRegisterUser();
    }
  }

  public toggleRegisterUser(): void {
    this.hasSubmitButtonBeenClicked = true;
    setTimeout(() => {
      this.hasTheFormBeenSubmitted = true;
      if (!this.userRegistrationForm.valid) {
        this.hasSubmitButtonBeenClicked = false;
        return;
      }
      const newUser = this.createRegisterUserObject();
      this.registerService.registerNewUser(newUser).subscribe(
        (res: IUserRegisterResponse) => {
          if (res.status) {
            this.registrationSuccessfulTextConfig();
            this.toggleModal(res.message);
            this.hasSubmitButtonBeenClicked = false;
          }
        },
        (error: IUserRegisterResponse) => {
          this.registrationUnSuccessfulTextConfig();
          this.toggleModal(error.message);
          this.hasSubmitButtonBeenClicked = false;
        }
      );
    }, 200);
  }

  private createRegisterUserObject(): RegisterUser {
    const username = this.userRegistrationForm.value.username;
    const password = this.userRegistrationForm.value.password;
    const email = this.userRegistrationForm.value.email;
    return new RegisterUser(username, password, email);
  }

  private registrationSuccessfulTextConfig(): void {
    this.modalTitle = "Registration successful";
    this.registrationSuccessful = true;
  }

  private registrationUnSuccessfulTextConfig(): void {
    this.modalTitle = "Registration unsuccessful";
    this.registrationSuccessful = false;
  }

  private toggleModal(message: string): void {
    this.modalBody = message;
    $("#error-modal").modal();
  }
}
