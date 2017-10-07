import { AppRoutingModule } from "./app.routing.module";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { AuthenicationControl } from "./shared/authenication/AuthenicationControl";
import { RequestHeaders } from "./shared/http/RequestHeaders";
import { NavbarTopComponent } from "./components/navbar-top/navbar-top.component";

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
    AuthenicationControl,
    RequestHeaders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
