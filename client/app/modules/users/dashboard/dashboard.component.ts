import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../../shared/services/dashboard.service";
import { Dashboard } from "../../../shared/models/dashboard.model";

@Component({
  selector: "app-users-dashboard",
  styleUrls: ["./dashboard.component.css"],
  templateUrl: "dashboard.component.html",
  providers: [DashboardService]
})

export class DashboardComponent implements OnInit {

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

  }
}
