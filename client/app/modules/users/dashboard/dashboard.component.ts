import { Component, OnInit } from "@angular/core";
import { Dashboard } from "./shared/dashboard.model";
import { DashboardService } from "./shared/dashboard.service";

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
