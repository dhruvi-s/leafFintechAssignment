import { TestBed } from '@angular/core/testing';

import { Sensez9Service } from './sensez9.service';

describe('Sensez9Service', () => {
  let service: Sensez9Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sensez9Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
