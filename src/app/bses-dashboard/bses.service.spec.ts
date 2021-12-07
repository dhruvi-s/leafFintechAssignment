import { TestBed } from '@angular/core/testing';

import { BsesService } from './bses.service';

describe('BsesService', () => {
  let service: BsesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BsesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
