import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {OrderDetailsService} from "@spartacus/order/components";

@Component({
  selector: 'cx-order-details-shipping',
  templateUrl: './worldline-order-detail-shipping.component.html',
})
export class WorldlineOrderDetailShippingComponent implements OnInit {
  constructor(protected orderDetailsService: OrderDetailsService) {}

  order$!: Observable<any>;

  ngOnInit() {
    this.order$ = this.orderDetailsService.getOrderDetails();
  }
}
