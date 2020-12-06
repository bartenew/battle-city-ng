import {TestBed} from '@angular/core/testing';

import {GameStoreService} from './game-store.service';

describe('GameStoreService', () => {
  let service: GameStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
