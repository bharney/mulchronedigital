import { TestBed, inject } from '@angular/core/testing';

import { UserDashboardHomeComponent } from './user-dashboard-home.component';
import { GoogleAnalytics } from '../../../../../shared/services/google-analytics.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserDashboardHomeComponent', () => {
	let component: UserDashboardHomeComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule
			],
			providers: [
				UserDashboardHomeComponent,
				GoogleAnalytics
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([UserDashboardHomeComponent], (UserDashboardHomeComponent) => {
		component = UserDashboardHomeComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});