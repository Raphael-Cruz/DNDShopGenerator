import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipIndex } from './tooltip-index';

describe('TooltipIndex', () => {
  let component: TooltipIndex;
  let fixture: ComponentFixture<TooltipIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TooltipIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TooltipIndex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
