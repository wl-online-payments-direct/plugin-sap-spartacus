import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlineOrderTotalsComponent } from './worldline-order-totals.component';

describe('WorldlineOrderTotalsComponent', () => {
  let component: WorldlineOrderTotalsComponent;
  let fixture: ComponentFixture<WorldlineOrderTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlineOrderTotalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlineOrderTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
