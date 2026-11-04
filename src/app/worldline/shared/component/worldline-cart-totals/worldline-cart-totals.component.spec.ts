import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlineCartTotalsComponent } from './worldline-cart-totals.component';

describe('WorldlineCartTotalsComponent', () => {
  let component: WorldlineCartTotalsComponent;
  let fixture: ComponentFixture<WorldlineCartTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlineCartTotalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlineCartTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
