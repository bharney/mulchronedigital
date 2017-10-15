import { TestBed, inject } from '@angular/core/testing';

import { UserDashboardChangeUsernameComponent } from './user-dashboard-change-username.component';

describe('a user-dashboard-change-username component', () => {
	let component: UserDashboardChangeUsernameComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				UserDashboardChangeUsernameComponent
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