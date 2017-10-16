import { TestBed, inject } from '@angular/core/testing';

import { UserDashboardProfilePictureComponent } from './user-dashboard-profile-picture.component';

describe('a user-dashboard-profile-picture component', () => {
	let component: UserDashboardProfilePictureComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				UserDashboardProfilePictureComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([UserDashboardProfilePictureComponent], (UserDashboardProfilePictureComponent) => {
		component = UserDashboardProfilePictureComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});