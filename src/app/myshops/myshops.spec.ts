import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myshops } from './myshops';

describe('Myshops', () => {
  let component: Myshops;
  let fixture: ComponentFixture<Myshops>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Myshops]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Myshops);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
