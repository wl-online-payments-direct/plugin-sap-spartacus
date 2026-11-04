import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlinePaymentMethodComponent } from './worldline-payment-method.component';

describe('WorldlinePaymentMethodComponent', () => {
  let component: WorldlinePaymentMethodComponent;
  let fixture: ComponentFixture<WorldlinePaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlinePaymentMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlinePaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
