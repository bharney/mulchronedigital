import { TestBed, inject } from '@angular/core/testing';

import { UserDashboardChangeUsernameComponent } from './user-dashboard-change-username.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeUsernameService } from '../../../../../shared/services/user-dashboard.service';
import { ApiRequests } from '../../../../../shared/http/ApiRequests';
import { AuthenicationControl } from '../../../../../shared/authenication/AuthenicationControl';
import { UserDashboardEmitter } from '../../../../../shared/services/emitters/user-dashboard-emitter.service';
import { GoogleAnalytics } from '../../../../../shared/services/google-analytics.service';

describe('UserDashboardChangeUsernameComponent', () => {
	let component: UserDashboardChangeUsernameComponent;

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
				UserDashboardChangeUsernameComponent,
				ChangeUsernameService,
				ApiRequests,
				AuthenicationControl,
				UserDashboardEmitter,
				GoogleAnalytics
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([UserDashboardChangeUsernameComponent], (UserDashboardChangeUsernameComponent) => {
		component = UserDashboardChangeUsernameComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});