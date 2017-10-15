import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";



const appRoutes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  // { path: "home", loadChildren: "./modules/home/home.module#HomeLazyModule" },
  { path: "users", loadChildren: "./modules/users/users.module#UsersLazyModule" },
  { path: "dashboard", loadChildren: "./modules/dashboard/dashboard.module#DashboardLazyModule" },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
