import { TestBed } from '@angular/core/testing';

import { FootballUpdatesService } from './football-updates.service';

describe('FootballUpdatesService', () => {
  let service: FootballUpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FootballUpdatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
