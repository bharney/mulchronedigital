import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { UsersRouting } from "./users.routing";
import { AuthenicationControl } from "../../shared/authenication/AuthenicationControl";
import { SharedModule } from "../../shared/modules/shared.module";
import { ActivateUserComponent } from "./activate-user/activate-user.component";

@NgModule({
  imports: [
    UsersRouting,
    ReactiveFormsModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    RegisterComponent,
    LoginComponent,
    ActivateUserComponent
],
  providers: [
    AuthenicationControl
  ]
})
export class UsersLazyModule { }

