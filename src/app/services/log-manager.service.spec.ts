import { TestBed } from '@angular/core/testing';

import { LogManagerService } from './log-manager.service';

describe('LogManagerService', () => {
  let service: LogManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
