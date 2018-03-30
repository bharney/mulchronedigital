import { TestBed, inject } from "@angular/core/testing";

import { UserDashboardNavigationComponent } from "./user-dashboard-navigation.component";
import { UserDashboardEmitter } from "../../../../../shared/services/emitters/user-dashboard-emitter.service";

describe("UserDashboardNavigationComponent", () => {
	let component: UserDashboardNavigationComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				UserDashboardNavigationComponent,
				UserDashboardEmitter
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([UserDashboardNavigationComponent], (UserDashboardNavigationComponent) => {
		component = UserDashboardNavigationComponent;
	}));

	it("should have an instance", () => {
		expect(component).toBeDefined();
	});
});