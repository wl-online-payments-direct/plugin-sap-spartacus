import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {OrderFacade} from '@spartacus/order/root';
import {EventService} from '@spartacus/core';
import {PlaceOrderService} from '../../facade/place-order.service'
import { CheckoutQueryResetEvent } from '@spartacus/checkout/base/root';

@Component({
  selector: 'worldline-order-confirmation-overview',
  templateUrl: './worldline-order-confirmation-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorldlineOrderConfirmationOverviewComponent implements OnInit, OnDestroy {

  order$: Observable<any>;
  orderGuid: string;
  isGuestCustomer: boolean;

  constructor(protected orderFacade: OrderFacade,
              protected eventService: EventService,
              protected placeOrderService: PlaceOrderService) {}

  ngOnInit() {
    this.order$ = this.placeOrderService.getOrderDetails();
  }

  ngOnDestroy() {
    this.eventService.dispatch({}, CheckoutQueryResetEvent);;
  }
}
