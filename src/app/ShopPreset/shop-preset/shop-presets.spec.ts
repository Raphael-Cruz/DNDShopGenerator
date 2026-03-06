import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopPreset } from './shop-presets';

describe('ShopPreset', () => {
  let component: ShopPreset;
  let fixture: ComponentFixture<ShopPreset>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopPreset]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ShopPreset);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
