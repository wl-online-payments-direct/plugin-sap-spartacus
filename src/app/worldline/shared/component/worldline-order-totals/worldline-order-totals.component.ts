import { Component, OnInit, Input } from '@angular/core';
import { OrderSummaryComponent } from '@spartacus/cart/base/components';
import { Cart } from '../../../model/cart.model'

@Component({
  selector: 'worldline-order-totals',
  templateUrl: './worldline-order-totals.component.html',
  styleUrls: ['./worldline-order-totals.component.scss']
})
export class WorldlineOrderTotalsComponent extends OrderSummaryComponent {

  @Input() override cart: Cart;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

}
