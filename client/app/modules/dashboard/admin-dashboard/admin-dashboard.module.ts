import { AdminDashboardComponent } from "./admin-dashboard.component";
import { AdminDashboardHomeComponent } from "./components/admin-dashboard-home/admin-dashboard-home.component";
import { AdminDashboardRouting } from "./admin-dashboard.routing";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { SharedModule } from "../../../shared/modules/shared.module";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AdminAuthGuard } from "../../../shared/authenication/AdminAuthGuard";
import { AdminDashboardNavigationComponent } from "./components/admin-dashboard-navigation/admin-dashboard-navigation.component";
import { AdminDashboardEmitter } from "../../../shared/services/emitters/admin-dashboard-emitter.service";
import { AdminDashboardUsersComponent } from "./components/admin-dashboard-users/admin-dashboard-users.component";

@NgModule({
    imports: [
        AdminDashboardRouting,
        ReactiveFormsModule,
        CommonModule,
        SharedModule
    ],
    declarations: [
        AdminDashboardComponent,
        AdminDashboardHomeComponent,
        AdminDashboardNavigationComponent,
        AdminDashboardUsersComponent
    ],
    providers: [
        AdminAuthGuard,
        AuthenicationControl, 
        AdminDashboardEmitter
    ]
})
export class AdminDashboardLazyModule { }

