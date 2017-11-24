import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { ActivateUserComponent } from "./activate-user/activate-user.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "activeuser", component: ActivateUserComponent },
  { path: "forgotpassword", component: ForgotPasswordComponent }
];

export const UsersRouting: ModuleWithProviders = RouterModule.forChild(routes);
