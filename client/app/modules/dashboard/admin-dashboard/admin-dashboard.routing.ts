import { AdminDashboardComponent } from "./admin-dashboard.component";
import { AdminDashboardHomeComponent } from "./components/admin-dashboard-home/admin-dashboard-home.component";
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminAuthGuard } from "../../../shared/authenication/AdminAuthGuard";



const routes: Routes = [
    { path: "user", component: AdminDashboardComponent, canActivate: [AdminAuthGuard] },
];

export const AdminDashboardRouting: ModuleWithProviders = RouterModule.forChild(routes);
