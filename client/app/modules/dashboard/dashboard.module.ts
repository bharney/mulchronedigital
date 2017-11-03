import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { DashboardRouting } from "./dashboard.routing";
import { AuthenicationControl } from "../../shared/authenication/AuthenicationControl";
import { ClientAuthGuard } from "../../shared/authenication/ClientAuthGuard";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { UserDashboardHomeComponent } from "./user-dashboard/components/user-dashboard-home/user-dashboard-home.component";
import { UserDashboardService } from "../../shared/services/user-dashboard.service";
import { UserDashboardChangePasswordComponent } from "./user-dashboard/components/user-dashboard-change-password/user-dashboard-change-password.component";
import { UserDashboardChangeUsernameComponent } from "./user-dashboard/components/user-dashboard-change-username/user-dashboard-change-username.component";
import { UserDashboardProfilePictureComponent } from "./user-dashboard/components/user-dashboard-profile-picture/user-dashboard-profile-picture.component";
import { SharedModule } from "../../shared/modules/shared.module";
import { UserDashboardEmitter } from "../../shared/services/user-dashboard-emitter.service";

@NgModule({
  imports: [
    DashboardRouting,
    ReactiveFormsModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    AdminDashboardComponent,
    UserDashboardComponent,
    UserDashboardHomeComponent,
    UserDashboardChangePasswordComponent,
    UserDashboardChangeUsernameComponent,
    UserDashboardProfilePictureComponent
  ],
  providers: [
    ClientAuthGuard,
    AuthenicationControl,
    UserDashboardService,
    UserDashboardEmitter
  ]
})
export class DashboardLazyModule { }

