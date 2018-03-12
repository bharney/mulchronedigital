/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { AdminDashboardUsersComponent } from "./admin-dashboard-users.component";

describe("AdminDashboardUsersComponent", () => {
  let component: AdminDashboardUsersComponent;
  let fixture: ComponentFixture<AdminDashboardUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDashboardUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
