import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopInputs } from './shop-inputs';

describe('ShopInputs', () => {
  let component: ShopInputs;
  let fixture: ComponentFixture<ShopInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopInputs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopInputs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
