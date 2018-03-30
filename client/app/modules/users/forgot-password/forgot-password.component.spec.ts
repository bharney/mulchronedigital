/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ForgotPasswordComponent } from './forgot-password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { ErrorModalComponent } from '../../../components/error-modal/error-modal.component';
import { ApiRequests } from '../../../shared/http/ApiRequests';
import { AuthenicationControl } from '../../../shared/authenication/AuthenicationControl';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleAnalytics } from '../../../shared/services/google-analytics.service';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ 
        ForgotPasswordComponent, 
        ErrorModalComponent
      ],
      providers: [
        ApiRequests,
        AuthenicationControl,
        GoogleAnalytics
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
