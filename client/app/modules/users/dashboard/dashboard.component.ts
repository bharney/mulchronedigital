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
  dashboard: Dashboard[] = [];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getList().subscribe((res) => {
      this.dashboard = res;
    });
  }
}
