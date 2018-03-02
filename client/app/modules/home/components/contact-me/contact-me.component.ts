import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, MinLengthValidator } from "@angular/forms";
import { ContactMeService } from "../../../../shared/services/contact-me.service";
import { UserAuthenicationValidator } from "../../../../../../shared/UserAuthenicationValidator";
import { ContactMe } from "../../../../../../shared/ContactMe";
import { Encryption } from "../../../../../../shared/Encryption";
import { IContactMeResponse } from "../../../../shared/models/home.model";
declare const $: any;

@Component({
  selector: "app-contact-me",
  templateUrl: "./contact-me.component.html",
  styleUrls: ["./contact-me.component.css"]
})
export class ContactMeComponent implements OnInit {
  public contactMeForm: FormGroup;
  public hasSubmitButtonBeenClicked: boolean = false;
  public hasTheFormBeenSubmitted: boolean;
  public modalTitle: string = "";
  public modalBody: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private contactMeService: ContactMeService
  ) { }

  ngOnInit() {
    this.createFormGroup();
  }

  private createFormGroup(): void {
    this.contactMeForm = this.formBuilder.group({
      name: [
        "",
        [Validators.required, Validators.minLength(3)]
      ],
      email: [
        "",
        [Validators.required, UserAuthenicationValidator.emailValidation]
      ],
      message: [
        "",
        [Validators.required, Validators.minLength(25)]
      ]
    });
  }

  public async toggleContactMe() {
    this.hasTheFormBeenSubmitted = true;
    setTimeout(async () => {
      this.hasSubmitButtonBeenClicked = true;
      if (!this.contactMeForm.valid) {
        this.hasSubmitButtonBeenClicked = false;
        return;
      }
      const contactMeObject = this.createContactMeObject();
      const stringData = JSON.stringify(contactMeObject);
      const encryptedContactMeObject = await Encryption.AESEncrypt(stringData);
      this.contactMeService.sendContactMe(encryptedContactMeObject).subscribe(
        (response: IContactMeResponse) => {
          if (response.status) {
            this.hasSubmitButtonBeenClicked = false;
            this.hasTheFormBeenSubmitted = false;
            this.modalBody = response.message;
            this.modalTitle = "Your message was sent";
            this.contactMeForm.reset();
            $("#error-modal").modal();
          }
        }, (error: IContactMeResponse) => {
          this.hasSubmitButtonBeenClicked = false;
          this.hasTheFormBeenSubmitted = false;
          this.modalBody = error.message;
          this.modalTitle = "Contact me failed";
          $("#error-modal").modal();
        });
    }, 200);
  }

  private createContactMeObject() {
    const userName = this.contactMeForm.value.name;
    const userEmail = this.contactMeForm.value.email;
    const message = this.contactMeForm.value.message;
    return new ContactMe(userName, userEmail, message);
  }
}
