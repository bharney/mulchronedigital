import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserAuthenicationValidator } from "../../../../../shared/UserAuthenicationValidator";
import { ForgotPasswordService } from "./forgot-password.service";
import { ActivatedRoute, Router } from "@angular/router";
declare const $: any;

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
  providers: [ForgotPasswordService]
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup;
  public resetPasswordForm: FormGroup;
  public hasTheFormBeenSubmitted: boolean = false;
  public hasSubmitButtonBeenClicked: boolean = false;
  public modalTitle: string = "";
  public modalBody: string = "";
  public doesComponentHaveToken: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private forgotPasswordService: ForgotPasswordService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.hasOwnProperty("resettoken")) {
        this.doesComponentHaveToken = true;
        this.createResetPasswordForm();
      } else {
        this.doesComponentHaveToken = false;
        this.createRequestPasswordForgotFormGroup();
      }
    });
  }

  private createRequestPasswordForgotFormGroup(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [
        "",
        [Validators.required, UserAuthenicationValidator.emailValidation]
      ]
    });
  }

  private createResetPasswordForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      tokenPassword: [
        "",
        [Validators.required, Validators.minLength(12), Validators.maxLength(12)]
      ],
      newPassword: [
        "",
        [Validators.required, UserAuthenicationValidator.passwordValidation]
      ],
      confirmNewPassword: [
        "",
        // confirm matching.
      ]
    });
  }

  public handleDownKeyOnForm(event): void {
    if (event.keyCode === 13) {
      this.toggleForgotPasswordSubmit();
    }
  }

  public toggleForgotPasswordSubmit(): void {
    if (!this.forgotPasswordForm.valid || this.hasTheFormBeenSubmitted) {
      return;
    }
    this.hasTheFormBeenSubmitted = true;
    this.forgotPasswordService.resetUserPassword(this.forgotPasswordForm.value).subscribe(response => {
      this.hasTheFormBeenSubmitted = false;
      this.modalTitle = "Success";
      this.modalBody = response.message;
      $("#error-modal").modal();
    }, (error) => {
      this.hasTheFormBeenSubmitted = false;
      this.modalTitle = "Failure";
      this.modalBody = error.message;
      $("#error-modal").modal();
    });
    console.log(this.forgotPasswordForm.value);
  }

}
