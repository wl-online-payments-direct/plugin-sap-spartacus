import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlineCheckoutProgressMobileBottomComponent } from './worldline-checkout-progress-mobile-bottom.component';

describe('WorldlineCheckoutProgressMobileBottomComponent', () => {
  let component: WorldlineCheckoutProgressMobileBottomComponent;
  let fixture: ComponentFixture<WorldlineCheckoutProgressMobileBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlineCheckoutProgressMobileBottomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlineCheckoutProgressMobileBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
