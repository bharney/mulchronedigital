import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserAuthenicationValidator } from "../../../../../shared/UserAuthenicationValidator";
import { ForgotPasswordService } from "./forgot-password.service";
declare const $: any;

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
  providers: [ForgotPasswordService]
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup;
  public hasTheFormBeenSubmitted: boolean = false;
  public hasSubmitButtonBeenClicked: boolean = false;
  public modalTitle: string = "";
  public modalBody: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private forgotPasswordService: ForgotPasswordService
  ) { }

  ngOnInit() {
    this.createFormGroup();
  }

  private createFormGroup(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [
        "",
        [Validators.required, UserAuthenicationValidator.emailValidation]
      ]
    });
  }

  public handleDownKeyOnForm(event): void {
    if (event.keyCode === 13) {
      this.toggleForgotPasswordSubmit();
    }
  }

  public toggleForgotPasswordSubmit(): void {
    if (!this.forgotPasswordForm.valid) {
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
