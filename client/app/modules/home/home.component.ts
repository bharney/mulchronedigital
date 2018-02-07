import { Component, OnInit } from "@angular/core";
import { AuthenicationControl } from "../../shared/authenication/AuthenicationControl";
declare const $: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

  constructor(
    public authControl: AuthenicationControl
  ) { }

  ngOnInit() {
    this.setupRawJquery();
  }

  private setupRawJquery() {
    $("[data-toggle='tooltip']").tooltip();
  }
}
