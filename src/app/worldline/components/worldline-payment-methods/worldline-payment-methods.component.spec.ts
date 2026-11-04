import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlinePaymentMethodsComponent } from './worldline-payment-methods.component';

describe('WorldlinePaymentMethodsComponent', () => {
  let component: WorldlinePaymentMethodsComponent;
  let fixture: ComponentFixture<WorldlinePaymentMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlinePaymentMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlinePaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
