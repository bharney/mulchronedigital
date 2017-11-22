/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ActivateUserService } from './activate-user.service';

describe('Service: ActivateUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivateUserService]
    });
  });

  it('should ...', inject([ActivateUserService], (service: ActivateUserService) => {
    expect(service).toBeTruthy();
  }));
});