/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { AdminDashboardNavigationComponent } from "./admin-dashboard-navigation.component";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthenicationControl } from "../../../../../shared/authenication/AuthenicationControl";
import { AdminDashboardEmitter } from "../../../../../shared/services/emitters/admin-dashboard-emitter.service";

describe("AdminDashboardNavigationComponent", () => {
  let component: AdminDashboardNavigationComponent;
  let fixture: ComponentFixture<AdminDashboardNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ 
        AdminDashboardNavigationComponent 
      ],
      providers: [
        AuthenicationControl,
        AdminDashboardEmitter
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
