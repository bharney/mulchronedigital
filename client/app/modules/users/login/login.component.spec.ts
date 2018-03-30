import { TestBed, inject } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

import { LoginComponent } from "./login.component";
import { LoginService } from "../../../shared/services/user-authenication.service";
import { LoginUser } from "../../../shared/models/user-authenication.model";
import { ApiRequests } from "../../../shared/http/ApiRequests";
import { GoogleAnalytics } from "../../../shared/services/google-analytics.service";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";

describe("LoginComponent", () => {
  let component: LoginComponent;

  // register all needed dependencies
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: LoginService, useClass: MockLoginService },
        LoginComponent,
        ApiRequests,
        GoogleAnalytics,
        AuthenicationControl
      ]
    });
  });

  // instantiation through framework injection
  beforeEach(inject([LoginComponent], (LoginComponent) => {
    component = LoginComponent;
  }));

  it("should have an instance", () => {
    expect(component).toBeDefined();
  });
});

// Mock of the original login service
class MockLoginService extends LoginService {
  getList(): Observable<any> {
    return Observable.from([{ id: 1, name: "One" }, { id: 2, name: "Two" }]);
  }
}
