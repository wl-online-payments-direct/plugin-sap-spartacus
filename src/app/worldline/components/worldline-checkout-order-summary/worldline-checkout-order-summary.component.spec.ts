import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlineCheckoutOrderSummaryComponent } from './worldline-checkout-order-summary.component';

describe('WorldlineCheckoutOrderSummaryComponent', () => {
  let component: WorldlineCheckoutOrderSummaryComponent;
  let fixture: ComponentFixture<WorldlineCheckoutOrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlineCheckoutOrderSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlineCheckoutOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
