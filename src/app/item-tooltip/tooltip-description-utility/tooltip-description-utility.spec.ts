import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipDescriptionUtility } from './tooltip-description-utility';

describe('TooltipDescriptionUtility', () => {
  let component: TooltipDescriptionUtility;
  let fixture: ComponentFixture<TooltipDescriptionUtility>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TooltipDescriptionUtility]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TooltipDescriptionUtility);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
