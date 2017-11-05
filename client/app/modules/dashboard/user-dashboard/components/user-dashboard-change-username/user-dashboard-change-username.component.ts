import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserDashboardService } from "../../../../../shared/services/user-dashboard.service";
import { UserAuthenicationValidator } from "../../../../../../../shared/UserAuthenicationValidator";
import { UserChangeUsername } from "../../../../../shared/models/dashboard.model";
import { UserDashboardEmitter } from "../../../../../shared/services/emitters/user-dashboard-emitter.service";
declare const $: any;

@Component({
  selector: "app-user-dashboard-change-username",
  templateUrl: "./user-dashboard-change-username.component.html",
  styleUrls: ["./user-dashboard-change-username.component.css"]
})

export class UserDashboardChangeUsernameComponent implements OnInit {
  public userChangeUsernameForm: FormGroup;
  public hasTheFormBeenSubmitted: boolean = false;
  public modalBody: string;

  constructor(
    private formBuilder: FormBuilder,
    private userDashboardService: UserDashboardService,
    private userDashboardEmitter: UserDashboardEmitter
  ) { }

  ngOnInit() {
    this.configureUserChangeUsernameForm();
  }

  private configureUserChangeUsernameForm(): void {
    this.userChangeUsernameForm = this.formBuilder.group({
      newUsername: [
        "testuser23",
        [Validators.required, Validators.minLength(4), Validators.maxLength(12)]
      ],
      password: [
        "TestPassword1!",
        [Validators.required, UserAuthenicationValidator.passwordValidation]
      ],
    });
  }

  public toggleSubmitUsernameChange(): void {
    this.hasTheFormBeenSubmitted = true;
    if (!this.userChangeUsernameForm.valid) {
      return;
    }
    const changeUsernameObj: UserChangeUsername = this.createChangeUsernameObject();
    this.toggleChangeUsernameService(changeUsernameObj);
  }

  private createChangeUsernameObject(): UserChangeUsername {
    return new UserChangeUsername(this.userChangeUsernameForm.value.newUsername, this.userChangeUsernameForm.value.password);
  }

  private toggleChangeUsernameService(changeUsernameObj: UserChangeUsername): void {
    this.userDashboardService.changeUsername(changeUsernameObj)
      .subscribe((res) => {
        if (res.status) {
          const emitterObject = {"type": "Update user information on dashboard"};
          this.userDashboardEmitter.emitChange(emitterObject);
          this.modalBody = res.message;
          this.hasTheFormBeenSubmitted = false;
          this.userChangeUsernameForm.reset();
          $("#error-modal").modal();
        }
      }, (error) => {
        this.modalBody = error.message;
        $("#error-modal").modal();
      });
  }
}
