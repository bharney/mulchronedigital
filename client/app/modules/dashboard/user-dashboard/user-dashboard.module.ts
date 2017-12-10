import { UserDashboardEmitter } from "../../../shared/services/emitters/user-dashboard-emitter.service";
import { ChangeUsernameService, ChangeUserPasswordService, ChangeUserProfileImageService, MainDashboardService } from "../../../shared/services/user-dashboard.service";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { ClientAuthGuard } from "../../../shared/authenication/ClientAuthGuard";
import { UserDashboardNavigationComponent, } from "./components/user-dashboard-navigation/user-dashboard-navigation.component";
import { UserDashboardProfilePictureComponent } from "./components/user-dashboard-profile-picture/user-dashboard-profile-picture.component";
import { UserDashboardChangeUsernameComponent } from "./components/user-dashboard-change-username/user-dashboard-change-username.component";
import { UserDashboardChangePasswordComponent } from "./components/user-dashboard-change-password/user-dashboard-change-password.component";
import { UserDashboardHomeComponent } from "./components/user-dashboard-home/user-dashboard-home.component";
import { UserDashboardComponent } from "./user-dashboard.component";
import { SharedModule } from "../../../shared/modules/shared.module";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserDashboardRouting } from "./user-dashboard.routing";


@NgModule({
    imports: [
        UserDashboardRouting,
        ReactiveFormsModule,
        CommonModule,
        SharedModule
    ],
    declarations: [
        UserDashboardComponent,
        UserDashboardHomeComponent,
        UserDashboardChangePasswordComponent,
        UserDashboardChangeUsernameComponent,
        UserDashboardProfilePictureComponent,
        UserDashboardNavigationComponent
    ],
    providers: [
        ClientAuthGuard,
        AuthenicationControl,
        UserDashboardEmitter,
        ChangeUserPasswordService,
        ChangeUsernameService,
        ChangeUserProfileImageService,
        MainDashboardService
    ]
})
export class UserDashboardLazyModule { }

