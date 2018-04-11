import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserAuthenicationValidator } from "../../../../../../../shared/UserAuthenicationValidator";
import { UserChangePassword, IUserChangePasswordResponse } from "../../../../../shared/models/dashboard.model";
import { ChangeUserPasswordService } from "../../../../../shared/services/user-dashboard.service";
import { Encryption } from "../../../../../../../shared/Encryption";
import { GoogleAnalytics } from "../../../../../shared/services/google-analytics.service";
import { AESEncryptionResult } from "../../../../../../../shared/AESEncryptionResult";
declare const $: any;

@Component({
  selector: "app-user-dashboard-change-password",
  templateUrl: "./user-dashboard-change-password.component.html",
  styleUrls: ["./user-dashboard-change-password.component.css"]
})
export class UserDashboardChangePasswordComponent implements OnInit {
  public userChangePasswordForm: FormGroup;
  public hasTheFormBeenSubmitted: boolean = false;
  public modalBody: string;
  public modalTitle: string;
  public hasSubmitButtonBeenClicked: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private changeUserPasswordService: ChangeUserPasswordService,
    private googleAnalytics: GoogleAnalytics
  ) { }

  ngOnInit() {
    this.configureUserChangePasswordForm();
  }

  private configureUserChangePasswordForm(): void {
    this.userChangePasswordForm = this.formBuilder.group({
      currentPassword: [
        "",
        [Validators.required, UserAuthenicationValidator.passwordValidation]
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

  public handleDownKeyOnForm(event): void {
    if (event.keyCode === 13) {
      this.toggleSubmitNewUserPassword();
    }
  }

  public toggleSubmitNewUserPassword(): void {
    this.hasSubmitButtonBeenClicked = true;
    setTimeout(async () => {
      if (!this.hasTheFormBeenSubmitted) {
        this.hasTheFormBeenSubmitted = true;
        this.hasSubmitButtonBeenClicked = false;
      }
      if (!this.userChangePasswordForm.valid) {
        this.hasSubmitButtonBeenClicked = false;
        return;
      }
      const changePasswordObj: UserChangePassword = this.createUserChangePasswordWord();
      const stringData = JSON.stringify(changePasswordObj);
      const encryptedChangePasswordObject: AESEncryptionResult = await Encryption.AESEncrypt(stringData);
      this.subcribeToChangePasswordService(encryptedChangePasswordObject);
    }, 200);
  }

  private createUserChangePasswordWord(): UserChangePassword {
    return new UserChangePassword(
      this.userChangePasswordForm.value.currentPassword,
      this.userChangePasswordForm.value.password
    );
  }

  private subcribeToChangePasswordService(encryptedChangePasswordObject: AESEncryptionResult): void {
    this.changeUserPasswordService.changeUserPassword(encryptedChangePasswordObject).subscribe(
      (res: IUserChangePasswordResponse) => {
        if (res.status) {
          this.modalBody = res.message;
          this.hasTheFormBeenSubmitted = false;
          this.userChangePasswordForm.reset();
          $("#error-modal").modal();
          this.hasSubmitButtonBeenClicked = false;
          // TODO: clear the inputs.
        }
      },
      (error: IUserChangePasswordResponse) => {
        this.modalTitle = "There was a problem changing your password";
        this.modalBody = error.message;
        $("#error-modal").modal();
        this.hasSubmitButtonBeenClicked = false;
      }
    );
  }
}
