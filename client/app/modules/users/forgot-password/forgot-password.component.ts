import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserAuthenicationValidator } from "../../../../../shared/UserAuthenicationValidator";
import { ActivatedRoute, Router } from "@angular/router";
import { GoogleAnalytics } from "../../../shared/services/google-analytics.service";
import { Encryption } from "../../../../../shared/Encryption";
import { ResetPassword } from "../../../shared/models/user-authenication.model";
import { AESEncryptionResult } from "../../../../../shared/AESEncryptionResult";
import { ForgotPasswordService } from "../../../shared/services/forgot-password.service";
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
  public resetTokenId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private googleAnalytics: GoogleAnalytics,
    private router: Router
  ) { }

  ngOnInit() {
    this.createResetPasswordForm();
    this.createRequestPasswordForgotFormGroup();
    this.activatedRoute.params.subscribe(params => {
      this.resetTokenId = params["resettoken"];
      UserAuthenicationValidator.isThisAValidMongoObjectId(this.resetTokenId)
        .then(result => {
          if (result) {
            this.doesComponentHaveToken = true;
          } else {
            this.doesComponentHaveToken = false;
          }
        });
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
      password: [
        "",
        [Validators.required, UserAuthenicationValidator.passwordValidation]
      ],
      confirmPassword: [
        "",
        [Validators.required, UserAuthenicationValidator.confirmPasswordValidation]
      ]
    });
  }

  public handleDownKeyOnForm(event, whichForm: string): void {
    if (event.keyCode !== 13 || this.hasTheFormBeenSubmitted) {
      return;
    }
    if (whichForm === "forgotPasswordForm") {
      this.toggleForgotPasswordSubmit();
    } else if (whichForm === "resetPasswordForm") {
      this.toggleResetPasswordSubmit();
    }
  }

  public async toggleForgotPasswordSubmit(): Promise<void> {
    this.hasSubmitButtonBeenClicked = true;
    setTimeout(async () => {
      this.hasTheFormBeenSubmitted = true;
      if (!this.forgotPasswordForm.valid) {
        this.hasSubmitButtonBeenClicked = false;
        return;
      }
      const stringData = JSON.stringify(this.forgotPasswordForm.value);
      const encryptedForgotPasswordObject: AESEncryptionResult = await Encryption.AESEncrypt(stringData);
      this.forgotPasswordService.forgotPassword(encryptedForgotPasswordObject).subscribe(response => {
        this.hasTheFormBeenSubmitted = false;
        this.hasSubmitButtonBeenClicked = false;
        this.modalTitle = "Success";
        this.modalBody = response.message;
        $("#error-modal").modal();
        this.forgotPasswordForm.reset();
      }, (error) => {
        this.hasTheFormBeenSubmitted = false;
        this.hasSubmitButtonBeenClicked = false;
        this.modalTitle = "Failure";
        this.modalBody = error.message;
        $("#error-modal").modal();
      });
    }, 200);
  }

  public async toggleResetPasswordSubmit(): Promise<void> {
    this.hasSubmitButtonBeenClicked = true;
    setTimeout(async () => {
      this.hasTheFormBeenSubmitted = true;
      if (!this.resetPasswordForm.valid) {
        this.hasSubmitButtonBeenClicked = false;
        return;
      }
      const resetPasswordObject: ResetPassword = this.createResetPasswordObject();
      const stringData = JSON.stringify(resetPasswordObject);
      const encryptedForgotPasswordObject: AESEncryptionResult = await Encryption.AESEncrypt(stringData);
      this.forgotPasswordService.resetUserPassword(encryptedForgotPasswordObject).subscribe(response => {
        this.hasTheFormBeenSubmitted = false;
        this.hasSubmitButtonBeenClicked = false;
        this.modalTitle = "Success";
        this.modalBody = response.message;
        $("#error-modal").modal();
        this.resetPasswordForm.reset();
        setTimeout(() => {
          $("#error-modal").modal("hide");
          this.router.navigate(["../../users/login"]);
        }, 3000);
      }, (error) => {
        this.hasTheFormBeenSubmitted = false;
        this.hasSubmitButtonBeenClicked = false;
        this.modalTitle = "Failure";
        this.modalBody = error.message;
        $("#error-modal").modal();
      });
    }, 200);
  }

  private createResetPasswordObject(): ResetPassword {
    const tokenId = this.resetTokenId;
    const tokenPassword = this.resetPasswordForm.value.tokenPassword;
    const newPassword = this.resetPasswordForm.value.confirmPassword;
    return new ResetPassword(tokenId, tokenPassword, newPassword);
  }
}
