import { TestBed, inject } from '@angular/core/testing';

import { UserDashboardProfilePictureComponent } from './user-dashboard-profile-picture.component';
import { ChangeUserProfileImageService } from '../../../../../shared/services/user-dashboard.service';
import { UserDashboardEmitter } from '../../../../../shared/services/emitters/user-dashboard-emitter.service';
import { GoogleAnalytics } from '../../../../../shared/services/google-analytics.service';
import { HttpModule } from '@angular/http';
import { ApiRequests } from '../../../../../shared/http/ApiRequests';
import { AuthenicationControl } from '../../../../../shared/authenication/AuthenicationControl';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserDashboardProfilePictureComponent', () => {
	let component: UserDashboardProfilePictureComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpModule,
				RouterTestingModule
			],
			providers: [
				UserDashboardProfilePictureComponent,
				ChangeUserProfileImageService,
				UserDashboardEmitter,
				GoogleAnalytics,
				ApiRequests,
				AuthenicationControl
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