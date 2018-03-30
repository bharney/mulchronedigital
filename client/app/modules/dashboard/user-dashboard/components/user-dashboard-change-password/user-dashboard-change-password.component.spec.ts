import { TestBed, inject } from '@angular/core/testing';

import { UserDashboardChangePasswordComponent } from './user-dashboard-change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeUserPasswordService } from '../../../../../shared/services/user-dashboard.service';
import { HttpModule } from '@angular/http';
import { ApiRequests } from '../../../../../shared/http/ApiRequests';
import { GoogleAnalytics } from '../../../../../shared/services/google-analytics.service';
import { AuthenicationControl } from '../../../../../shared/authenication/AuthenicationControl';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserDashboardChangePasswordComponent', () => {
	let component: UserDashboardChangePasswordComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpModule,
				FormsModule,
				ReactiveFormsModule, 
				RouterTestingModule
			],
			providers: [
				UserDashboardChangePasswordComponent,
				ChangeUserPasswordService,
				ApiRequests,
				GoogleAnalytics,
				AuthenicationControl
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([UserDashboardChangePasswordComponent], (UserDashboardChangePasswordComponent) => {
		component = UserDashboardChangePasswordComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});