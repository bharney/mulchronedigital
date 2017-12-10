import { AdminDashboardComponent } from "./admin-dashboard.component";
import { AdminDashboardHomeComponent } from "./components/admin-dashboard-home/admin-dashboard-home.component";
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";



const routes: Routes = [
    {path: "user", component: AdminDashboardComponent},
];

export const AdminDashboardRouting: ModuleWithProviders = RouterModule.forChild(routes);
