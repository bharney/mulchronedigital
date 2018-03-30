/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DisclaimerModalComponent } from './disclaimer-modal.component';
import { UserRegisterEmitter } from '../../shared/services/emitters/user-register-emitter.service';

describe('DisclaimerModalComponent', () => {
  let component: DisclaimerModalComponent;
  let fixture: ComponentFixture<DisclaimerModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisclaimerModalComponent],
      providers: [UserRegisterEmitter]
    });
    fixture = TestBed.createComponent(DisclaimerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("it should create an instance", () => {
    expect(component).toBeTruthy();
  });

});
