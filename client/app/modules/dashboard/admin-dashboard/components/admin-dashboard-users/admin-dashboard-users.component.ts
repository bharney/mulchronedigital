import { Component, OnInit } from "@angular/core";
import { GetUsersService } from "../../../../../shared/services/users-administration.service";
import { IUserAdministration } from "../../../../../shared/models/admin-dashboard.model";

@Component({
  selector: "app-admin-dashboard-users",
  templateUrl: "./admin-dashboard-users.component.html",
  styleUrls: ["./admin-dashboard-users.component.css"]
})
export class AdminDashboardUsersComponent implements OnInit {
  public users: IUserAdministration[];

  constructor(
    private getUsersService: GetUsersService
  ) { }

  ngOnInit() {
    this.getListOfUsers();
  }

  private getListOfUsers(): void {
    this.getUsersService.getUsersInformation().subscribe(response => {
      if (response.status) {
        this.users = response.users;
        console.log(this.users);
      }
    }, (error) => {

    });
  }

  public deactiveUserAccount(id: string): void {
    
  }

  public activeUserAccount(id: string): void {
    
  }

  public makeUserAdmin(id: string): void {
    
  }

  public revokeUserAdminAccess(id: string): void {
    
  }
}
