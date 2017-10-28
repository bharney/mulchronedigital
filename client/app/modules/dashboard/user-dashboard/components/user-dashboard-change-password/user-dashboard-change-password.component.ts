import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserAuthenicationValidator } from "../../../../../../../shared/UserAuthenicationValidator";
import { UserDashboardService } from "../../../../../shared/services/user-dashboard.service";
import { UserChangePassword, IUserChangePasswordResponse } from "../../../../../shared/models/dashboard.model";
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

  constructor(
    private formBuilder: FormBuilder,
    private userDashboardService: UserDashboardService
  ) { }

  ngOnInit() {
    this.configureUserChangePasswordForm();
  }

  private configureUserChangePasswordForm(): void {
    this.userChangePasswordForm = this.formBuilder.group({
      currentPassword: [
        "TestPassword1!",
        [Validators.required, UserAuthenicationValidator.passwordValidation]
      ],
      password: [
        "TestPassword1!@#$%",
        [Validators.required, UserAuthenicationValidator.passwordValidation]
      ],
      confirmPassword: [
        "TestPassword1!@#$%",
        [Validators.required, UserAuthenicationValidator.confirmPasswordValidation]
      ]
    });
  }

  public toggleSubmitNewUserPassword(): void {
    if (!this.hasTheFormBeenSubmitted) {
      this.hasTheFormBeenSubmitted = true;
    }
    if (!this.userChangePasswordForm.valid) {
      return;
    }
    const changePasswordObj: UserChangePassword = this.createUserChangePasswordWord();
    this.subcribeToChangePasswordService(changePasswordObj);
  }

  private createUserChangePasswordWord(): UserChangePassword {
    return new UserChangePassword(this.userChangePasswordForm.value.currentPassword, this.userChangePasswordForm.value.password);
  }

  private subcribeToChangePasswordService(changePasswordObj: UserChangePassword): void {
    this.userDashboardService.changeUserPassword(changePasswordObj)
      .subscribe((res: IUserChangePasswordResponse) => {
        if (res.status) {
          this.modalBody = res.message;
          this.clearChangePasswordFormInputs();
          $("#error-modal").modal();
          // TODO: clear the inputs.
        }
      }, (error: IUserChangePasswordResponse) => {
        this.modalBody = error.message;
        this.modalTitle = "There was a problem changing your password";
        $("#error-modal").modal();
        // TODO: throw some error messages into a modal.
      });
  }

  private clearChangePasswordFormInputs(): void {
    this.userChangePasswordForm.value.currentPassword = "";
    this.userChangePasswordForm.value.password = "";
    this.userChangePasswordForm.value.confirmPassword = "";
  }
}
