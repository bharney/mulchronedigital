import { TestBed, inject } from "@angular/core/testing";

import { UserDashboardComponent } from "./user-dashboard.component";
import { MainDashboardService } from "../../../shared/services/user-dashboard.service";
import { HttpModule } from "@angular/http";
import { ApiRequests } from "../../../shared/http/ApiRequests";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { ActivatedRoute } from "@angular/router";
import { GoogleAnalytics } from "../../../shared/services/google-analytics.service";
import { RouterTestingModule } from "@angular/router/testing";
import { UserDashboardEmitter } from "../../../shared/services/emitters/user-dashboard-emitter.service";

describe("UserDashboardComponent", () => {
  let component: UserDashboardComponent;

  // register all needed dependencies
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        RouterTestingModule
      ],
      providers: [
        UserDashboardComponent,
        MainDashboardService,
        ApiRequests,
        AuthenicationControl,
        GoogleAnalytics,
        UserDashboardEmitter
      ]
    });
  });

  // instantiation through framework injection
  beforeEach(inject([UserDashboardComponent], (UserDashboardComponent) => {
    component = UserDashboardComponent;
  }));

  it("should have an instance", () => {
    expect(component).toBeDefined();
  });
});
