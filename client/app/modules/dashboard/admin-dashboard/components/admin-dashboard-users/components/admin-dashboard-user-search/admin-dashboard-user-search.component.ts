import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-admin-dashboard-user-search",
  templateUrl: "./admin-dashboard-user-search.component.html",
  styleUrls: ["./admin-dashboard-user-search.component.css"]
})
export class AdminDashboardUserSearchComponent implements OnInit {
  public userSearchForm: FormGroup;
  @Output() userSearchEvent: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.createFormGroup();
  }

  private createFormGroup(): void {
    this.userSearchForm = this.formBuilder.group({
      usernamesearch: [
        "",
        [Validators.required]
      ]
    });
  }

  public handleKeyDownOnForm(keyCode): void {
    if (keyCode !== 13 || !this.userSearchForm.value.usernamesearch) {
      return;
    }
    this.toggleUsernameSearch();
  }

  public toggleUsernameSearch() {
    if (!this.userSearchForm.value.usernamesearch) {
      return;
    }
    const userSearch = this.userSearchForm.value.usernamesearch;
    this.userSearchEvent.emit(userSearch);
    this.userSearchForm.reset();
  }
}
