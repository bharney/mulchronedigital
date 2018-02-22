import { Component, OnInit } from "@angular/core";
import { GoogleAnalytics } from "../../../../../shared/services/google-analytics.service";

@Component({
  selector: "app-user-dashboard-home",
  templateUrl: "./user-dashboard-home.component.html",
  styleUrls: ["./user-dashboard-home.component.css"]
})

export class UserDashboardHomeComponent implements OnInit {

  constructor(
    private googleAnalytics: GoogleAnalytics
  ) { }

  ngOnInit() { }
}
