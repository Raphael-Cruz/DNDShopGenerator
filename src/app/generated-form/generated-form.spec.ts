import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedForm } from './generated-form';

describe('GeneratedForm', () => {
  let component: GeneratedForm;
  let fixture: ComponentFixture<GeneratedForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneratedForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratedForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
