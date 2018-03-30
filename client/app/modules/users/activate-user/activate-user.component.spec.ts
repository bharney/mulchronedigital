/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActivateUserComponent } from './activate-user.component';
import { HttpModule } from '@angular/http';
import { ApiRequests } from '../../../shared/http/ApiRequests';
import { AuthenicationControl } from '../../../shared/authenication/AuthenicationControl';
import { GoogleAnalytics } from '../../../shared/services/google-analytics.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ActivateUserComponent', () => {
  let component: ActivateUserComponent;
  let fixture: ComponentFixture<ActivateUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        RouterTestingModule
      ],
      declarations: [
        ActivateUserComponent
      ],
      providers: [
        ApiRequests,
        AuthenicationControl,
        GoogleAnalytics
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
