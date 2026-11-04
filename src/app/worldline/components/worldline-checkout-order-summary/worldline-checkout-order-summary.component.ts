import { Component, OnInit } from '@angular/core';
import { CheckoutOrderSummaryComponent } from '@spartacus/checkout/base/components';

@Component({
  selector: 'worldline-checkout-order-summary',
  templateUrl: './worldline-checkout-order-summary.component.html',
  styleUrls: ['./worldline-checkout-order-summary.component.scss']
})
export class WorldlineCheckoutOrderSummaryComponent extends CheckoutOrderSummaryComponent {}
