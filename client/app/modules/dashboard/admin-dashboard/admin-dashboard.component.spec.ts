import { TestBed, inject } from "@angular/core/testing";

import { AdminDashboardComponent } from "./admin-dashboard.component";

describe("a admin-dashboard component", () => {
  let component: AdminDashboardComponent;

  // register all needed dependencies
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminDashboardComponent
      ]
    });
  });

  // instantiation through framework injection
  beforeEach(inject([AdminDashboardComponent], (AdminDashboardComponent) => {
    component = AdminDashboardComponent;
  }));

  it("should have an instance", () => {
    expect(component).toBeDefined();
  });
});
