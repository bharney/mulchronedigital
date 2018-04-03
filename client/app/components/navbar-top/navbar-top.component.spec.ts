import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTopComponent } from './navbar-top.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenicationControl } from '../../shared/authenication/AuthenicationControl';
import { RefreshTokenService } from '../../shared/services/refresh-token.service';
import { HttpModule } from '@angular/http';
import { ApiRequests } from '../../shared/http/ApiRequests';

describe('NavbarTopComponent', () => {
  let component: NavbarTopComponent;
  let fixture: ComponentFixture<NavbarTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        RouterTestingModule
      ],
      declarations: [ 
        NavbarTopComponent 
      ],
      providers: [
        AuthenicationControl,
        RefreshTokenService, 
        ApiRequests
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
