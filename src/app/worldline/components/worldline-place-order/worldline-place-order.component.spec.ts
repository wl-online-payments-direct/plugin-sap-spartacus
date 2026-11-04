import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlinePlaceOrderComponent } from './worldline-place-order.component';

describe('WorldlinePlaceOrderComponent', () => {
  let component: WorldlinePlaceOrderComponent;
  let fixture: ComponentFixture<WorldlinePlaceOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlinePlaceOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlinePlaceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
