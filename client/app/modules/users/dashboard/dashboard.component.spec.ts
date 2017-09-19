import { TestBed, inject } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

import { DashboardComponent } from "./dashboard.component";
import { DashboardService } from "../../../shared/services/dashboard.service";
import { Dashboard } from "../../../shared/models/dashboard.model";

describe("a dashboard component", () => {
  let component: DashboardComponent;

  // register all needed dependencies
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        DashboardComponent
      ]
    });
  });

  // instantiation through framework injection
  beforeEach(
    inject([DashboardComponent], DashboardComponent => {
      component = DashboardComponent;
    })
  );

  it("should have an instance", () => {
    expect(component).toBeDefined();
  });
});

// Mock of the original dashboard service
class MockDashboardService extends DashboardService {
  getList(): Observable<any> {
    return Observable.from([{ id: 1, name: "One" }, { id: 2, name: "Two" }]);
  }
}
