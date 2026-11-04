import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {
  ConverterService,
  OccEndpointsService,
  StateWithProcess
} from '@spartacus/core';
import {CartActions} from '@spartacus/cart/base/core';
import { ReplenishmentOrder } from '@spartacus/order/root/model';
import {Observable, Subscription} from 'rxjs';
import {WorldlineActions} from '../store/actions';
import {StateWithWorldline} from '../store/worldline-state';
import {WorldlineSelectors} from '../store/selectors';
import {Order} from "../model/cart.model";
import { RemoveCartEvent } from '@spartacus/cart/base/root';
import { ORDER_TYPE, OrderPlacedEvent, ReplenishmentOrderScheduledEvent } from '@spartacus/order/root';
import { CheckoutQueryResetEvent } from '@spartacus/checkout/base/root';
import {EventService} from '@spartacus/core';
import { PlaceOrderService } from './place-order.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceHostedCheckoutResponseService {
  subscriptions = new Subscription();
  constructor(protected http: HttpClient,
              protected occEndpoints: OccEndpointsService,
              protected converter: ConverterService,
              protected store: Store<StateWithWorldline | StateWithProcess<void>>,
              protected eventService: EventService,
              protected placeOrderService: PlaceOrderService) {

  }


  public submit(userId: string, orderOrReplenishmentCode: string, orderType: ORDER_TYPE, params: {
    RETURNMAC: string,
    hostedCheckoutId: string,
    cartId: string
  }): void {
    return this.store.dispatch(new WorldlineActions.PlaceHostedCheckoutResponseSubmit({
      userId: userId,
      orderOrReplenishmentCode: orderOrReplenishmentCode,
      orderType: orderType,
      params: params
    }));
  }


  public getSubmitSuccess(): Observable<boolean> {
    return this.store.pipe(select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.placeHostedCheckoutResponseSuccess(state as StateWithWorldline)));
  }

  public getSubmitFail(): Observable<boolean> {
    return this.store.pipe(select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.placeHostedCheckoutResponseFail(state as StateWithWorldline)));
  }

  public getSubmitCancel(): Observable<boolean> {
    return this.store.pipe(select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.placeHostedCheckoutResponseCancel(state as StateWithWorldline)));
  }

  public clearSubmitState(): void {
    this.store.dispatch(new WorldlineActions.ClearPlaceHostedCheckoutResponse());
  }

  public getSubmitData(): Observable<Order | ReplenishmentOrder> {
    return this.store.pipe(select((state: StateWithWorldline | StateWithProcess<void> ) => WorldlineSelectors.placeHostedCheckoutResponseResult(state as StateWithWorldline)));
  }

  public onSubmitSuccess(resp: Order | ReplenishmentOrder, cartId: string, orderType: ORDER_TYPE, userId: string): void {
    switch (orderType) {
      case ORDER_TYPE.PLACE_ORDER: {
        this.placeOrderService.setPlacedOrder(resp);
        this.eventService.dispatch({
            userId: userId,
            cartId,
            /**
             * As we know the cart is not anonymous (precondition checked),
             * we can safely use the cartId, which is actually the cart.code.
             */
            cartCode: cartId,
            order: resp,
        }, OrderPlacedEvent);
        break;
      }
      case ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER: {
        this.placeOrderService.setPlacedOrder(resp);
        this.eventService.dispatch({
            userId: userId,
            cartId,
            /**
             * As we know the cart is not anonymous (precondition checked),
             * we can safely use the cartId, which is actually the cart.code.
             */
            cartCode: cartId,
            replenishmentOrder: resp,
        }, ReplenishmentOrderScheduledEvent);
        break
      }
    }
  }


}
