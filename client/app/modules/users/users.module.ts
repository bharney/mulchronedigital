import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { UsersRouting } from "./users.routing";
import { AuthenicationControl } from "../../shared/authenication/AuthenicationControl";
import { ErrorModalComponent } from "../../components/error-modal/error-modal.component";

@NgModule({
  imports: [
    UsersRouting,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [
    RegisterComponent,
    LoginComponent,
    ErrorModalComponent
  ],
  providers: [
    AuthenicationControl
  ]
})
export class UsersLazyModule { }

