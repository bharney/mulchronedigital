import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
declare const $: any;

@Component({
  selector: "app-error-modal",
  templateUrl: "./error-modal.component.html",
  styleUrls: ["./error-modal.component.css"]
})

export class ErrorModalComponent implements OnInit {
   @Input() title: string;
   @Input() body: string;
   @Input() registrationSuccessful: boolean;
   @Input() passwordChangeSuccessful: boolean;

  constructor(
    private router: Router
  ) { }

  ngOnInit() { }

  public closeModalAndNavigateToLogin(): void {
    $("#error-modal").modal("hide");
    setTimeout(() => {
      this.router.navigate(["../../users/login"]);
    }, 1000);
  }
}
