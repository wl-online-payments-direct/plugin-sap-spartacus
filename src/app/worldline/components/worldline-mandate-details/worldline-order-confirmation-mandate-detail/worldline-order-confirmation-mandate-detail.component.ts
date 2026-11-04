import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {OrderFacade} from '@spartacus/order/root';
import {PlaceOrderService} from '../../../facade/place-order.service';
import {TranslationService} from "@spartacus/core";

@Component({
  selector: 'worldline-Order-confirmation-mandate-detail',
  templateUrl: './worldline-order-confirmation-mandate-detail.component.html',
  styleUrls: ['./worldline-order-confirmation-mandate-detail.component.scss']
})
export class WorldlineOrderConfirmationMandateDetailComponent implements OnInit {

  order$: Observable<any>;

  constructor(protected orderFacade: OrderFacade, protected translation: TranslationService, protected placeOrderService: PlaceOrderService) {
  }

  ngOnInit() {
    this.order$ = this.placeOrderService.getOrderDetails();
  }

}
