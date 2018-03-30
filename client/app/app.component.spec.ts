import { TestBed, async } from "@angular/core/testing";

import { AppComponent } from "./app.component";
import { NavbarTopComponent } from "./components/navbar-top/navbar-top.component";
import { AppRoutingModule } from "./app.routing.module";
import { APP_BASE_HREF } from "@angular/common";
import { AuthenicationControl } from "./shared/authenication/AuthenicationControl";
import { ApiRequests } from "./shared/http/ApiRequests";
import { RefreshTokenService } from "./shared/services/refresh-token.service";
import { GoogleAnalytics } from "./shared/services/google-analytics.service";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarTopComponent
      ],
      imports: [BrowserModule, HttpModule, AppRoutingModule],
      providers: [
        AuthenicationControl,
        ApiRequests,
        RefreshTokenService,
        GoogleAnalytics,
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  }));

  it("should create the app", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
