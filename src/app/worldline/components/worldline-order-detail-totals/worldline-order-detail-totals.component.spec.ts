import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlineOrderDetailTotalsComponent } from './worldline-order-detail-totals.component';

describe('WorldlineOrderDetailTotalsComponent', () => {
  let component: WorldlineOrderDetailTotalsComponent;
  let fixture: ComponentFixture<WorldlineOrderDetailTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlineOrderDetailTotalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlineOrderDetailTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
