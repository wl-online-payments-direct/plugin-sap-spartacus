import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlineCartProceedToCheckoutComponent } from './worldline-cart-proceed-to-checkout.component';

describe('WorldlineCartProceedToCheckoutComponent', () => {
  let component: WorldlineCartProceedToCheckoutComponent;
  let fixture: ComponentFixture<WorldlineCartProceedToCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlineCartProceedToCheckoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorldlineCartProceedToCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
