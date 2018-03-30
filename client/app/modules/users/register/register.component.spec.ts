import { TestBed, inject } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

import { RegisterComponent } from "./register.component";
import { RegisterService } from "../../../shared/services/user-authenication.service";
import { RegisterUser } from "../../../shared/models/user-authenication.model";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApiRequests } from "../../../shared/http/ApiRequests";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { RouterTestingModule } from "@angular/router/testing";
import { GoogleAnalytics } from "../../../shared/services/google-analytics.service";
import { UserRegisterEmitter } from "../../../shared/services/emitters/user-register-emitter.service";

describe("RegisterComponent", () => {
  let component: RegisterComponent;

  // register all needed dependencies
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterTestingModule
      ],
      providers: [
        { provide: RegisterService, useClass: MockRegisterService },
        RegisterComponent,
        ApiRequests,
        AuthenicationControl,
        GoogleAnalytics,
        UserRegisterEmitter
      ]
    });
  });

  // instantiation through framework injection
  beforeEach(inject([RegisterComponent], (RegisterComponent) => {
    component = RegisterComponent;
  }));

  it("should have an instance", () => {
    expect(component).toBeDefined();
  });
});

// Mock of the original register service
class MockRegisterService extends RegisterService {
  getList(): Observable<any> {
    return Observable.from([{ id: 1, name: "One" }, { id: 2, name: "Two" }]);
  }
}
