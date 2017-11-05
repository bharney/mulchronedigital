import { Component } from "@angular/core";
import { UserDashboardEmitter } from "../../../../../shared/services/emitters/user-dashboard-emitter.service";


@Component({
  selector: "app-user-dashboard-navigation",
  templateUrl: "./user-dashboard-navigation.component.html",
  styleUrls: ["./user-dashboard-navigation.component.css"]
})

export class UserDashboardNavigationComponent {

  constructor(
    private userDashboardEmitter: UserDashboardEmitter
  ) { }

  public navigateDashboad(event): void {
    const emitterObject = {"type": "Update user dashboard navigation", "event": event};
    this.userDashboardEmitter.emitChange(emitterObject);
  }
}
