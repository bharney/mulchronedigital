import { AppRoutingModule } from "./app.routing.module";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { AuthenicationControl } from "./shared/authenication/AuthenicationControl";
import { ApiRequests } from "./shared/http/ApiRequests";
import { NavbarTopComponent } from "./components/navbar-top/navbar-top.component";
import { RefreshTokenService } from "./shared/services/refresh-token.service";

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
    ApiRequests,
    RefreshTokenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
