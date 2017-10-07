import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { UsersRouting } from "./users.routing";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthenicationControl } from "../../shared/authenication/AuthenicationControl";
import { ClientAuthGuard } from "../../shared/authenication/ClientAuthGuard";

@NgModule({
  imports: [
    UsersRouting,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [
    RegisterComponent,
    LoginComponent,
    DashboardComponent
  ],
  providers: [
    ClientAuthGuard,
    AuthenicationControl
  ]
})
export class UsersLazyModule { }

