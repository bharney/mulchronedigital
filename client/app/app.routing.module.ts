import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";



const appRoutes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  // { path: "home", loadChildren: "./modules/home/home.module#HomeLazyModule" },
  { path: "users", loadChildren: "./modules/users/users.module#UsersLazyModule" }
  // { path: "userdashboard", loadChildren: "./modules/user-dashboard/user-dathboard.module#UserDashboardLazyModule" }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
