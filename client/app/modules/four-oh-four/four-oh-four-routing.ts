import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core/src/metadata/ng_module";
import { FourOhFourComponent } from "./four-oh-four.component";

const routes: Routes = [
    { path: "", component: FourOhFourComponent }
];

export const FourOhFourRouting: ModuleWithProviders = RouterModule.forChild(routes);