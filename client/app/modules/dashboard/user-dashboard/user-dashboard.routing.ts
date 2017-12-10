import {UserDashboardProfilePictureComponent} from "./components/user-dashboard-profile-picture/user-dashboard-profile-picture.component";
import {UserDashboardChangeUsernameComponent} from "./components/user-dashboard-change-username/user-dashboard-change-username.component";
import { UserDashboardHomeComponent } from "./components/user-dashboard-home/user-dashboard-home.component";
import {UserDashboardChangePasswordComponent} from "./components/user-dashboard-change-password/user-dashboard-change-password.component";
import { ClientAuthGuard } from "../../../shared/authenication/ClientAuthGuard";
import { UserDashboardComponent } from "./user-dashboard.component";
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";



const routes: Routes = [
  {
    path: "user", component: UserDashboardComponent, canActivate: [ClientAuthGuard], children:
    [
      { path: "home", component: UserDashboardHomeComponent, outlet: "dashboard", canActivate: [ClientAuthGuard] },
      { path: "changepassword", component: UserDashboardChangePasswordComponent, outlet: "dashboard", canActivate: [ClientAuthGuard] },
      { path: "changeusername", component: UserDashboardChangeUsernameComponent, outlet: "dashboard", canActivate: [ClientAuthGuard] },
      { path: "profilepicture", component: UserDashboardProfilePictureComponent, outlet: "dashboard", canActivate: [ClientAuthGuard] },
    ]
  },
];

export const UserDashboardRouting: ModuleWithProviders = RouterModule.forChild(routes);
