import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlineCheckoutProgressComponent } from './worldline-checkout-progress.component';

describe('WorldlineCheckoutProgressComponent', () => {
  let component: WorldlineCheckoutProgressComponent;
  let fixture: ComponentFixture<WorldlineCheckoutProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlineCheckoutProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlineCheckoutProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
