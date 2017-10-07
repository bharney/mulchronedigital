import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ClientAuthGuard } from "../../shared/authenication/ClientAuthGuard";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "dashboard/:id", component: DashboardComponent, canActivate: [ClientAuthGuard] }
];

export const UsersRouting: ModuleWithProviders = RouterModule.forChild(routes);
