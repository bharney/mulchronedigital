import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { UsersRouting } from "./users.routing";
import { AuthenicationControl } from "../../shared/authenication/AuthenicationControl";

@NgModule({
  imports: [
    UsersRouting,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [
    RegisterComponent,
    LoginComponent
  ],
  providers: [
    AuthenicationControl
  ]
})
export class UsersLazyModule { }

