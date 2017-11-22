import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core/src/metadata/ng_module";
import { HomeComponent } from "./home.component";

const routes: Routes = [
    { path: "", component: HomeComponent }
];

export const HomeRouting: ModuleWithProviders = RouterModule.forChild(routes);