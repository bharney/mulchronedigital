import { TestBed, inject } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

import { LoginComponent } from "./login.component";
import { LoginService } from "../../../shared/services/user-authenication.service";
import { ILoginUser } from "../../../shared/models/user-authenication.model";

describe("a login component", () => {
  let component: LoginComponent;

  // register all needed dependencies
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        { provide: LoginService, useClass: MockLoginService },
        LoginComponent
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
