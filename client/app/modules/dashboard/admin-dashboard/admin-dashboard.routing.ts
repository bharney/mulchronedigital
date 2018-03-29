import { AdminDashboardComponent } from "./admin-dashboard.component";
import { AdminDashboardHomeComponent } from "./components/admin-dashboard-home/admin-dashboard-home.component";
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminAuthGuard } from "../../../shared/authenication/AdminAuthGuard";
import { AdminDashboardUsersComponent } from "./components/admin-dashboard-users/admin-dashboard-users.component";



const routes: Routes = [
    {
        path: "user", component: AdminDashboardComponent, canActivate: [AdminAuthGuard], children:
            [
                { path: "home", component: AdminDashboardHomeComponent, outlet: "admindashboard", canActivate: [AdminAuthGuard] },
                { path: "users", component: AdminDashboardUsersComponent, outlet: "admindashboard", canActivate: [AdminAuthGuard] },
            ]
    },
];

export const AdminDashboardRouting: ModuleWithProviders = RouterModule.forChild(routes);
