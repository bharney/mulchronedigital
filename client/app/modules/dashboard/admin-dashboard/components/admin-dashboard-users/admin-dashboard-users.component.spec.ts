/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { AdminDashboardUsersComponent } from "./admin-dashboard-users.component";
import { RouterTestingModule } from "@angular/router/testing";
import { GetUsersService } from "../../../../../shared/services/users-administration.service";
import { HttpModule } from "@angular/http";
import { AuthenicationControl } from "../../../../../shared/authenication/AuthenicationControl";
import { ApiRequests } from "../../../../../shared/http/ApiRequests";

describe("AdminDashboardUsersComponent", () => {
  let component: AdminDashboardUsersComponent;
  let fixture: ComponentFixture<AdminDashboardUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, 
        HttpModule
      ],
      declarations: [
        AdminDashboardUsersComponent
      ],
      providers: [
        GetUsersService,
        AuthenicationControl,
        ApiRequests
      ]
    }).compileComponents();
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
