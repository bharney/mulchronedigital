import { ChangeUserProfileImageService } from "../../../../../shared/services/user-dashboard.service";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { UserDashboardEmitter } from "../../../../../shared/services/emitters/user-dashboard-emitter.service";
declare const $: any;

@Component({
  selector: "app-user-dashboard-profile-picture",
  templateUrl: "./user-dashboard-profile-picture.component.html",
  styleUrls: ["./user-dashboard-profile-picture.component.css"]
})

export class UserDashboardProfilePictureComponent {
  private imageFileExtensions: string[] = [".png", ".jpg", ".jpeg", ".gif"];
  @ViewChild("fileInput") fileInput: ElementRef;
  public modalBody: string;
  public hasSubmitButtonBeenClicked: boolean = false;

  constructor(
    private changeUserProfileImageService: ChangeUserProfileImageService,
    private userDashboardEmitter: UserDashboardEmitter
  ) { }

  public toggleUploadImage(): void {
    this.hasSubmitButtonBeenClicked = true;
    setTimeout(() => {
      const fileBrowser = this.fileInput.nativeElement;
      // TODO: check for common picture file extensions.
      if (fileBrowser.files && fileBrowser.files[0]) {
        const formData = new FormData();
        formData.append("image", fileBrowser.files[0]);
        for (let i = 0; i < this.imageFileExtensions.length; i++) {
          if (fileBrowser.files[0].name.includes(this.imageFileExtensions[i])) {
            this.startHttpMethodToUpdatePhoto(formData);
            return;
          }
        }
      }
      this.hasSubmitButtonBeenClicked = false;
      this.triggerInvalidImageTypeModal();
    }, 200);
  }

  private startHttpMethodToUpdatePhoto(formData: FormData): void {
    this.changeUserProfileImageService.changeUserProfileImage(formData).subscribe(response => {
      if (response.status) {
        const emitterObject = { "type": "Update user information on dashboard" };
        this.userDashboardEmitter.emitChange(emitterObject);
        this.fileInput.nativeElement.value = null;
        this.hasSubmitButtonBeenClicked = false;
      }
    }, (error) => {
      this.modalBody = error.message;
      this.fileInput.nativeElement.value = null;
      $("#error-modal").modal();
    });
  }

  private triggerInvalidImageTypeModal(): void {
    this.modalBody = "Invalid image type please try again";
    this.fileInput.nativeElement.value = null;
    $("#error-modal").modal();
    this.hasSubmitButtonBeenClicked = false;
  }
}
