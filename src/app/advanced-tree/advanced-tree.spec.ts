import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedTree } from './advanced-tree';

describe('AdvancedTree', () => {
  let component: AdvancedTree;
  let fixture: ComponentFixture<AdvancedTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvancedTree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedTree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
