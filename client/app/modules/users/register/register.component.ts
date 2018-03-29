import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RegisterService } from "../../../shared/services/user-authenication.service";
import { RegisterUser, IUserRegisterResponse } from "../../../shared/models/user-authenication.model";
import { UserAuthenicationValidator } from "../../../../../shared/UserAuthenicationValidator";
import { AESEncryptionResult, Encryption } from "../../../../../shared/Encryption";
import { GoogleAnalytics } from "../../../shared/services/google-analytics.service";
import { UserRegisterEmitter } from "../../../shared/services/emitters/user-register-emitter.service";
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
  private hasUserAccpectedDisclaimer: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private googleAnalytics: GoogleAnalytics,
    private userRegisterEmitter: UserRegisterEmitter
  ) { }

  ngOnInit(): void {
    this.createFormGroup();
    this.subscrbeToUserRegistrationEmitter();
  }

  private createFormGroup(): void {
    this.userRegistrationForm = this.formBuilder.group({
      username: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(12)]
      ],
      email: [
        "",
        [Validators.required, UserAuthenicationValidator.emailValidation]
      ],
      password: [
        "",
        [Validators.required, UserAuthenicationValidator.passwordValidation]
      ],
      confirmPassword: [
        "",
        [
          Validators.required,
          UserAuthenicationValidator.confirmPasswordValidation
        ]
      ]
    });
  }

  private subscrbeToUserRegistrationEmitter() {
    this.userRegisterEmitter.changeEmitted$.subscribe(response => {
      switch (response.type) {
        case "user accepted disclaimer":
          this.hasUserAccpectedDisclaimer = true;
          this.toggleRegisterUserService();
          break;
      }
    });
  }

  public handleRegisterUserSubmit(event): void {
    if (!this.userRegistrationForm.valid && event.keyCode === 13) {
      this.hasTheFormBeenSubmitted = true;
      return;
    }
    if (event.keyCode === 13 && !this.hasUserAccpectedDisclaimer) {
      $("#disclaimer-modal").modal();
      return;
    }
    if (event.type === "click" && !this.hasUserAccpectedDisclaimer) {
      $("#disclaimer-modal").modal();
      return;
    }
    if (event.type === "click" || event.keyCode === 13 && this.hasUserAccpectedDisclaimer) {
      this.toggleRegisterUserService();
    }
  }

  public toggleRegisterUserService(): void {
    this.hasSubmitButtonBeenClicked = true;
    setTimeout(async () => {
      this.hasTheFormBeenSubmitted = true;
      if (!this.userRegistrationForm.valid) {
        this.hasSubmitButtonBeenClicked = false;
        return;
      }
      const newUser = this.createRegisterUserObject();
      const stringData = JSON.stringify(newUser);
      const encryptedNewUserObject: AESEncryptionResult = await Encryption.AESEncrypt(stringData);
      this.registerService.registerNewUser(encryptedNewUserObject).subscribe((res: IUserRegisterResponse) => {
        if (res.status) {
          this.hasSubmitButtonBeenClicked = false;
          this.userRegistrationForm.reset();
          this.registrationSuccessfulTextConfig();
          this.toggleModal(res.message);
          this.hasTheFormBeenSubmitted = false;
        }
      }, (error: IUserRegisterResponse) => {
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
