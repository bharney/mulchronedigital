import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { HomeRouting } from "./home-routing";
import { ContactMeService } from "../../shared/services/contact-me.service";
import { ReactiveFormsModule } from "@angular/forms";
import { ContactMeComponent } from "./components/contact-me/contact-me.component";
import { SharedModule } from "../../shared/modules/shared.module";

@NgModule({
  imports: [
    CommonModule,
    HomeRouting,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    HomeComponent,
    ContactMeComponent
  ],
  providers: [
    ContactMeService
  ]
})

export class HomeLazyModule {

}
