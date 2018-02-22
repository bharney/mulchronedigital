import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ChangeUsernameService } from "../../../../../shared/services/user-dashboard.service";
import { UserAuthenicationValidator } from "../../../../../../../shared/UserAuthenicationValidator";
import { UserChangeUsername } from "../../../../../shared/models/dashboard.model";
import { UserDashboardEmitter } from "../../../../../shared/services/emitters/user-dashboard-emitter.service";
import { Encryption, AESEncryptionResult } from "../../../../../../../shared/Encryption";
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
  public hasSubmitButtonBeenClicked: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private changeUsernameService: ChangeUsernameService,
    private userDashboardEmitter: UserDashboardEmitter
  ) { }

  ngOnInit() {
    this.configureUserChangeUsernameForm();
  }

  private configureUserChangeUsernameForm(): void {
    this.userChangeUsernameForm = this.formBuilder.group({
      newUsername: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(12)]
      ],
      password: [
        "",
        [Validators.required, UserAuthenicationValidator.passwordValidation]
      ]
    });
  }

  public handleDownKeyOnForm(event): void {
    if (event.keyCode === 13) {
      this.toggleSubmitUsernameChange();
    }
  }

  public toggleSubmitUsernameChange(): void {
    this.hasSubmitButtonBeenClicked = true;
    setTimeout(async () => {
      this.hasTheFormBeenSubmitted = true;
      if (!this.userChangeUsernameForm.valid) {
        this.hasSubmitButtonBeenClicked = false;
        return;
      }
      const changeUsernameObj: UserChangeUsername = this.createChangeUsernameObject();
      const stringData = JSON.stringify(changeUsernameObj);
      const encryptedUserObject: AESEncryptionResult = await Encryption.AESEncrypt(stringData);
      this.toggleChangeUsernameService(encryptedUserObject);
    }, 200);
  }

  private createChangeUsernameObject(): UserChangeUsername {
    return new UserChangeUsername(
      this.userChangeUsernameForm.value.newUsername,
      this.userChangeUsernameForm.value.password
    );
  }

  private toggleChangeUsernameService(encryptedUserObject: AESEncryptionResult): void {
    this.changeUsernameService.changeUsername(encryptedUserObject).subscribe(res => {
      if (res.status) {
        const emitterObject = {
          type: "Update user information on dashboard"
        };
        this.userDashboardEmitter.emitChange(emitterObject);
        this.modalBody = res.message;
        this.hasTheFormBeenSubmitted = false;
        this.userChangeUsernameForm.reset();
        $("#error-modal").modal();
        this.hasSubmitButtonBeenClicked = false;
      }
    },
      error => {
        this.modalBody = error.message;
        $("#error-modal").modal();
        this.hasSubmitButtonBeenClicked = false;
      }
    );
  }
}
