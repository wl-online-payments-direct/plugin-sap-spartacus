import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlineReviewOrderSpaComponent } from './worldline-review-order.component';

describe('WorldlineReviewOrderSpaComponent', () => {
  let component: WorldlineReviewOrderSpaComponent;
  let fixture: ComponentFixture<WorldlineReviewOrderSpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlineReviewOrderSpaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlineReviewOrderSpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
