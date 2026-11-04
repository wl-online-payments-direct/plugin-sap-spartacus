import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlineOrderConfirmationTotalsComponent } from './worldline-order-confirmation-totals.component';

describe('WorldlineOrderConfirmationTotalsComponent', () => {
  let component: WorldlineOrderConfirmationTotalsComponent;
  let fixture: ComponentFixture<WorldlineOrderConfirmationTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlineOrderConfirmationTotalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlineOrderConfirmationTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
