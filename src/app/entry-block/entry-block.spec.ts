import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryBlock } from './entry-block';

describe('EntryBlock', () => {
  let component: EntryBlock;
  let fixture: ComponentFixture<EntryBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntryBlock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
