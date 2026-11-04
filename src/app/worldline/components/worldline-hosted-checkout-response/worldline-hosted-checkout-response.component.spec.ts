import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldlineHostedCheckoutResponseComponent } from './worldline-hosted-checkout-response.component';

describe('WorldlineHostedCheckoutResponseComponent', () => {
  let component: WorldlineHostedCheckoutResponseComponent;
  let fixture: ComponentFixture<WorldlineHostedCheckoutResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldlineHostedCheckoutResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldlineHostedCheckoutResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
