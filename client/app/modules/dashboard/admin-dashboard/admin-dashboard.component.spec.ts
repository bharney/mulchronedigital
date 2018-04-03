import { TestBed, inject } from "@angular/core/testing";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { AuthenicationControl } from "../../../shared/authenication/AuthenicationControl";
import { RouterTestingModule } from "@angular/router/testing";
import { AdminDashboardEmitter } from "../../../shared/services/emitters/admin-dashboard-emitter.service";

describe("a admin-dashboard component", () => {
  let component: AdminDashboardComponent;

  // register all needed dependencies
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        AdminDashboardComponent,
        AuthenicationControl,
        AdminDashboardEmitter
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
