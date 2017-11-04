import { Component, ElementRef, ViewChild } from "@angular/core";
import { UserDashboardService } from "../../../../../shared/services/user-dashboard.service";
import { UserDashboardEmitter } from "../../../../../shared/services/user-dashboard-emitter.service";
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

  constructor(
    private userDashboardService: UserDashboardService,
    private userDashboardEmitter: UserDashboardEmitter
  ) { }

  public toggleUploadImage(): void {
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
      this.triggerInvalidImageTypeModal();
    }
  }

  private startHttpMethodToUpdatePhoto(formData: FormData): void {
    this.userDashboardService.changeUserProfileImage(formData).subscribe(response => {
      if (response.status) {
        this.userDashboardEmitter.emitChange("Update user information on dashboard");
        this.fileInput.nativeElement.value = null;
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
  }
}
