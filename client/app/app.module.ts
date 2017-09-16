import { AppRoutingModule } from "./app.routing.module";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { NavbarTopComponent } from "./components/navbar-top/navbar-top.component";
import { AuthenicationControl } from "./shared/globals/AuthenicationControl";

@NgModule({
  declarations: [
    AppComponent,
    NavbarTopComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    AuthenicationControl
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
