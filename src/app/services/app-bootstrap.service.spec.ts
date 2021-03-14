import { TestBed } from '@angular/core/testing';

import { AppBootstrapService } from './app-bootstrap.service';

describe('AppBootstrapService', () => {
  let service: AppBootstrapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppBootstrapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
