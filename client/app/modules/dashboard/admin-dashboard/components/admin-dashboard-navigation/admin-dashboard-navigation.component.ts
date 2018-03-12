import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { JsonWebToken } from "../../../../../../../shared/JsonWebToken";
import { AuthenicationControl } from "../../../../../shared/authenication/AuthenicationControl";
import { AdminDashboardEmitter } from "../../../../../shared/services/emitters/admin-dashboard-emitter.service";

@Component({
  selector: "app-admin-dashboard-navigation",
  templateUrl: "./admin-dashboard-navigation.component.html",
  styleUrls: ["./admin-dashboard-navigation.component.css"]
})
export class AdminDashboardNavigationComponent implements OnInit {
  public id: string;
  private parentRouter: Router;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authControl: AuthenicationControl,
    private adminDashboardEmitter: AdminDashboardEmitter
  ) { }

  ngOnInit() {

  }

  public toggleAdminDashboardNavigation(event: any): void {
    const emitterObject = { "type": "Update admin dashboard navigation", "event": event };
    this.adminDashboardEmitter.emitChange(emitterObject);
    
  }
}
