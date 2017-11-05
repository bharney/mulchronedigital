import { TestBed, inject } from '@angular/core/testing';

import { DashboardNavigationComponent } from './dashboard-navigation.component';

describe('a dashboard-navigation component', () => {
	let component: DashboardNavigationComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				DashboardNavigationComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([DashboardNavigationComponent], (DashboardNavigationComponent) => {
		component = DashboardNavigationComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});