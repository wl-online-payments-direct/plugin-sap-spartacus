import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlineCheckoutProgressMobileTopComponent } from './worldline-checkout-progress-mobile-top.component';

describe('WorldlineCheckoutProgressMobileTopComponent', () => {
  let component: WorldlineCheckoutProgressMobileTopComponent;
  let fixture: ComponentFixture<WorldlineCheckoutProgressMobileTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlineCheckoutProgressMobileTopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlineCheckoutProgressMobileTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
