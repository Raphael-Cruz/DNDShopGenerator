import { TestBed } from '@angular/core/testing';

import { ShopGeneratorService } from './shop-generator-service';

describe('ShopGeneratorService', () => {
  let service: ShopGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
