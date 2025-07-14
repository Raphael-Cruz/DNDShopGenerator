import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComp } from './main-comp';

describe('MainComp', () => {
  let component: MainComp;
  let fixture: ComponentFixture<MainComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
