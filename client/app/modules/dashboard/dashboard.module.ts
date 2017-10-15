import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { DashboardRouting } from "./dashboard.routing";
import { AuthenicationControl } from "../../shared/authenication/AuthenicationControl";
import { ClientAuthGuard } from "../../shared/authenication/ClientAuthGuard";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";

@NgModule({
  imports: [
    DashboardRouting,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [
    AdminDashboardComponent,
    UserDashboardComponent
  ],
  providers: [
    ClientAuthGuard,
    AuthenicationControl
  ]
})
export class DashboardLazyModule { }

