import { Component, OnInit } from "@angular/core";
import { UsersAdministrationService } from "../../../../../shared/services/users-administration.service";

@Component({
  selector: "app-admin-dashboard-users",
  templateUrl: "./admin-dashboard-users.component.html",
  styleUrls: ["./admin-dashboard-users.component.css"]
})
export class AdminDashboardUsersComponent implements OnInit {

  constructor(
    private usersAdministrationService: UsersAdministrationService
  ) { }

  ngOnInit() {
    this.getListOfUsers();
  }

  private getListOfUsers(): void {
    this.usersAdministrationService.getUsersInformation().subscribe(response => {
      console.log(response);
    }, (error) => {
    });
  }
}
