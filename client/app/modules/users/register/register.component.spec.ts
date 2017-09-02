import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { RegisterComponent } from './register.component';
import { RegisterService } from './shared/register.service';
import { Register } from './shared/register.model';

describe('a register component', () => {
	let component: RegisterComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: RegisterService, useClass: MockRegisterService },
				RegisterComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([RegisterComponent], (RegisterComponent) => {
		component = RegisterComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original register service
class MockRegisterService extends RegisterService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
