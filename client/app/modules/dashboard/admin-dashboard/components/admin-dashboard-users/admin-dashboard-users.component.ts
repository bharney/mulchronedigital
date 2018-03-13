import { Component, OnInit } from "@angular/core";
import { UsersAdministrationService } from "../../../../../shared/services/users-administration.service";
import { IUserAdministration } from "../../../../../shared/models/admin-dashboard.model";

@Component({
  selector: "app-admin-dashboard-users",
  templateUrl: "./admin-dashboard-users.component.html",
  styleUrls: ["./admin-dashboard-users.component.css"]
})
export class AdminDashboardUsersComponent implements OnInit {
  public users: IUserAdministration[];

  constructor(
    private usersAdministrationService: UsersAdministrationService
  ) { }

  ngOnInit() {
    this.getListOfUsers();
  }

  private getListOfUsers(): void {
    this.usersAdministrationService.getUsersInformation().subscribe(response => {
      if (response.status) {
        this.users = response.users;
      }
    }, (error) => {
    });
  }
}
