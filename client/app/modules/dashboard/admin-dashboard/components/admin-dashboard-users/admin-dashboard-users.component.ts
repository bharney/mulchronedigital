import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-admin-dashboard-users",
  templateUrl: "./admin-dashboard-users.component.html",
  styleUrls: ["./admin-dashboard-users.component.css"]
})
export class AdminDashboardUsersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("who what");
  }

}
