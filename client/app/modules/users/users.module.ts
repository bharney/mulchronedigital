import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { RegisterService, LoginService } from "../../shared/services/user-authenication.service";
import { UsersRouting } from "./users.routing";
import { DashboardComponent } from "./dashboard/dashboard.component";

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
    RegisterService,
    LoginService
  ]
})
export class UsersLazyModule { }

