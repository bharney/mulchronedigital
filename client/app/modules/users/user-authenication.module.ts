import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { UserAuthenicationRouting } from "./user-authenication.routing";

import { AuthenicationControl } from "../../shared/authenication/authenication-control";
import { RegisterService, LoginService } from "../../shared/services/user-authenication.service";

@NgModule({
    imports: [
        UserAuthenicationRouting,
        ReactiveFormsModule,
        CommonModule,
    ],
    declarations: [
        RegisterComponent,
        LoginComponent
    ],
    providers: [
        RegisterService,
        LoginService,
        AuthenicationControl
    ]
})
export class UserAuthenicationLazyModule { }
