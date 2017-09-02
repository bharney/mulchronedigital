import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";



const appRoutes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", loadChildren: "./" },
  { path: "users", loadChildren: "./modules/user-authenication/user-authenication.module#UserAuthenicationLazyModule" },
  { path: "userdashboard", loadChildren: "./modules/user-dashboard/user-dathboard.module#UserDashboardLazyModule" }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
