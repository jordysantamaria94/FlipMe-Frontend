import { TestBed } from '@angular/core/testing';

import { FlipmeService } from './flipme.service';

describe('FlipmeService', () => {
  let service: FlipmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlipmeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
