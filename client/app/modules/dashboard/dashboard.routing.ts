import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ClientAuthGuard } from "../../shared/authenication/ClientAuthGuard";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { UserDashboardHomeComponent } from "./user-dashboard/components/user-dashboard-home/user-dashboard-home.component";
import { UserDashboardChangePasswordComponent } from "./user-dashboard/components/user-dashboard-change-password/user-dashboard-change-password.component";
import { UserDashboardChangeUsernameComponent } from "./user-dashboard/components/user-dashboard-change-username/user-dashboard-change-username.component";

const routes: Routes = [
  {
    path: "user", component: UserDashboardComponent, canActivate: [ClientAuthGuard], children:
    [
      { path: "home", component: UserDashboardHomeComponent, outlet: "dashboard" },
      { path: "changepassword", component: UserDashboardChangePasswordComponent, outlet: "dashboard"},
      { path: "changeusername", component: UserDashboardChangeUsernameComponent, outlet: "dashboard"},
    ]
  },
  { path: "admin", component: AdminDashboardComponent, canActivate: [] }
];

export const DashboardRouting: ModuleWithProviders = RouterModule.forChild(routes);
