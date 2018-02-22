import { Component, OnInit } from "@angular/core";
import { GoogleAnalytics } from "../../shared/services/google-analytics.service";

@Component({
  selector: "app-four-oh-four",
  templateUrl: "./four-oh-four.component.html",
  styleUrls: ["./four-oh-four.component.css"]
})
export class FourOhFourComponent implements OnInit {

  constructor(
    private googleAnalytics: GoogleAnalytics
  ) { }

  ngOnInit() {
  }

}
