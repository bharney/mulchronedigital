import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ClientAuthGuard } from "../../shared/authenication/ClientAuthGuard";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";

const routes: Routes = [
  { path: "user/:id", component: UserDashboardComponent, canActivate: [ClientAuthGuard] },
  { path: "admin", component: AdminDashboardComponent, canActivate: [] }
];

export const DashboardRouting: ModuleWithProviders = RouterModule.forChild(routes);
