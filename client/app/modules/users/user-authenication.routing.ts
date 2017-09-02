import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SignInComponent } from "./sign-in/sign-in.component";
import { RegisterComponent } from "./register/register.component";

const routes: Routes = [
  { path: "signin", component: SignInComponent },
  { path: "register", component: RegisterComponent }
];

export const UserAuthenicationRouting: ModuleWithProviders = RouterModule.forChild(routes);
