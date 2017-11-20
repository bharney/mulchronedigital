import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { ActivateUserComponent } from "./activate-user/activate-user.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "activeuser", component: ActivateUserComponent }
];

export const UsersRouting: ModuleWithProviders = RouterModule.forChild(routes);
