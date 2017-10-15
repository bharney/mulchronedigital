import { TestBed, inject } from '@angular/core/testing';

import { UserDashboardChangePasswordComponent } from './user-dashboard-change-password.component';

describe('a user-dashboard-change-password component', () => {
	let component: UserDashboardChangePasswordComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				UserDashboardChangePasswordComponent
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