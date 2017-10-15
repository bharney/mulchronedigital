import { TestBed, inject } from '@angular/core/testing';

import { UserDashboardHomeComponent } from './user-dashboard-home.component';

describe('a user-dashboard-home component', () => {
	let component: UserDashboardHomeComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				UserDashboardHomeComponent
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