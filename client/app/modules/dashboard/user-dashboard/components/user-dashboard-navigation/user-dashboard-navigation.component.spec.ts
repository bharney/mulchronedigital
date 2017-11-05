import { TestBed, inject } from '@angular/core/testing';

import { UserDashboardNavigationComponent } from './user-dashboard-navigation.component';

describe('a dashboard-navigation component', () => {
	let component: UserDashboardNavigationComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				DashboardNavigationComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([UserDashboardNavigationComponent], (UserDashboardNavigationComponent) => {
		component = UserDashboardNavigationComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});