import { TestBed } from '@angular/core/testing';

import { InputDatas } from './input-datas';

describe('InputDatas', () => {
  let service: InputDatas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputDatas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
