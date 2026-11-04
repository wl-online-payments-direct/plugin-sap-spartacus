import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {
  ConverterService,
  OccEndpointsService, StateWithProcess,
  UserIdService, EventService, CommandService, OCC_USER_ID_ANONYMOUS, CommandStrategy
} from '@spartacus/core';
import {ActiveCartFacade, OrderEntry} from '@spartacus/cart/base/root';
import { ORDER_NORMALIZER, OrderPlacedEvent, Order, ORDER_TYPE, ReplenishmentOrderScheduledEvent } from '@spartacus/order/root';
import {StateWithWorldline} from '../store/worldline-state';
import {WorldlineActions} from '../store/actions';
import {Observable, of, Subscription, BehaviorSubject, combineLatest} from 'rxjs';
import {CheckoutMethod} from '../model/payment.model';
import {WorldlineSelectors} from '../store/selectors';
import {HttpClient} from '@angular/common/http';
import {catchError, map, switchMap, tap, take} from 'rxjs/operators';
import {CheckoutConnector} from "../connector/checkout.connector";
import {TokenizationConnector} from "../connector/tokenization.connector";
import {GetHostedCheckoutConnector} from "../connector/get-hosted-checkout.connector";
import {GooglePayConnector} from "../connector/google-pay.connector";
import {PayByLinkConnector} from "../connector/pay-by-link.connector";
import { CheckoutQueryResetEvent } from '@spartacus/checkout/base/root';
import { RemoveCartEvent } from '@spartacus/cart/base/root';
import {WorldlineRedirectHOPEvent, WorldlineRedirectTokenizationEvent} from '../events';

@Injectable({
  providedIn: 'root'
})
export class PlaceOrderService {
  subscriptions = new Subscription();
  placedOrder$ = new BehaviorSubject(undefined);
  constructor(protected http: HttpClient,
              protected occEndpoints: OccEndpointsService,
              protected store: Store<StateWithWorldline | StateWithProcess<void>>,
              protected placeOrderStore: Store<StateWithWorldline | StateWithProcess<CheckoutMethod>>,
              protected activeCartFacade: ActiveCartFacade,
              protected userIdService: UserIdService,
              protected converter: ConverterService,
              protected checkoutConnector: CheckoutConnector,
              protected tokenizationConnector: TokenizationConnector,
              protected getHostedCheckoutConnector: GetHostedCheckoutConnector,
              protected googlePayConnector: GooglePayConnector,
              protected payByLinkConnector: PayByLinkConnector,
              protected eventService: EventService,
              protected commandService: CommandService) {
  }

  worldlinePlaceOrder(termsChecked: boolean): void {
    let userId;
    this.userIdService
      .getUserId()
      .subscribe((occUserId) => (userId = occUserId))
      .unsubscribe();

    let cartId;
    this.activeCartFacade
      .getActiveCartId()
      .subscribe((activeCartId) => (cartId = activeCartId))
      .unsubscribe();
    this.store.dispatch(new WorldlineActions.PlaceOrder({cartId, userId, termsChecked}))
  }
  public getCheckoutMethod(): Observable<CheckoutMethod> {
    return this.placeOrderStore.pipe(select((state: StateWithWorldline | StateWithProcess<CheckoutMethod>) => WorldlineSelectors.getCheckoutMethod(state as StateWithWorldline)));
  }

  resetCheckoutMethod() {
    return this.store.dispatch(new WorldlineActions.ResetOrder());
  }

  getPlaceOrderLoading(): Observable<boolean> {
    return this.store.pipe(
      select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.getCheckoutMethodStateLoading(state as StateWithWorldline))
    );
  }

  /**
   * Returns the place or schedule replenishment order's success flag
   */
  getPlaceOrderSuccess(): Observable<boolean> {
    return this.store.pipe(
      select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.getCheckoutMethodStateSuccess(state as StateWithWorldline))
    );
  }

  /**
   * Returns the place or schedule replenishment order's error flag
   */
  getPlaceOrderError(): Observable<boolean> {
    return this.store.pipe(
      select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.getCheckoutMethodStateFail(state as StateWithWorldline))
    );
  }

  placeOrderGooglePay(termsChecked: any, orderType: ORDER_TYPE) {
    if (orderType == ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER) {
      return this.placeReplenishmentOrderGooglePayCommand.execute(termsChecked);
    } else {
      return this.placeOrderGooglePayCommand.execute(termsChecked);
    }
  }

  placeOrderGooglePayCommand = this.commandService.create((payload) => this.checkoutPreconditions().pipe(switchMap(([userId, cartId]) => this.googlePayConnector.submit(userId, cartId).pipe(tap((order) => {
    if (order.order != null) {
      this.placedOrder$.next(order.order);
      this.eventService.dispatch({
        userId,
        cartId,
        cartCode: cartId,
        order: order.order,
      }, OrderPlacedEvent);
    } else {
      this.eventService.dispatch({
        tokenizationResponse: order
      }, WorldlineRedirectTokenizationEvent);

    }
  })))), {
    strategy: CommandStrategy.CancelPrevious,
  });

  placeReplenishmentOrderGooglePayCommand = this.commandService.create((payload) => this.checkoutPreconditions().pipe(switchMap(([userId, cartId]) => this.googlePayConnector.submitReplenishmentOrder(userId, cartId).pipe(tap((replenishmentOrder) => {
    if (replenishmentOrder.order != null) {
      this.setPlacedOrder(replenishmentOrder.order);
      this.eventService.dispatch({
        userId,
        cartId,
        cartCode: cartId,
        replenishmentOrder: replenishmentOrder.order,
      }, ReplenishmentOrderScheduledEvent);
    } else {
      this.eventService.dispatch({
        tokenizationResponse: replenishmentOrder
      }, WorldlineRedirectTokenizationEvent);
    }
  })))), {
    strategy: CommandStrategy.CancelPrevious,
  });

  placeOrderHT(termsChecked: any, orderType: ORDER_TYPE) {
    if (orderType == ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER) {
      return this.placeReplenishmentOrderHTCommand.execute(termsChecked);
    } else {
      return this.placeOrderHTCommand.execute(termsChecked);
    }
  }

  placeOrderHTCommand = this.commandService.create((payload) => this.checkoutPreconditions().pipe(switchMap(([userId, cartId]) => this.tokenizationConnector.submit(userId, cartId).pipe(tap((order) => {
      if (order.order != null) {
        this.placedOrder$.next(order.order);
        this.eventService.dispatch({
            userId,
            cartId,
            cartCode: cartId,
            order: order.order,
        }, OrderPlacedEvent);
      } else {
        this.eventService.dispatch({
         tokenizationResponse: order
        }, WorldlineRedirectTokenizationEvent);

      }
  })))), {
      strategy: CommandStrategy.CancelPrevious,
  });

  placeReplenishmentOrderHTCommand = this.commandService.create((payload) => this.checkoutPreconditions().pipe(switchMap(([userId, cartId]) => this.tokenizationConnector.submitReplenishmentOrder(userId, cartId).pipe(tap((replenishmentOrder) => {
      if (replenishmentOrder.order != null) {
        this.setPlacedOrder(replenishmentOrder.order);
        this.eventService.dispatch({
            userId,
            cartId,
            cartCode: cartId,
            replenishmentOrder: replenishmentOrder.order,
        }, ReplenishmentOrderScheduledEvent);
      } else {
        this.eventService.dispatch({
         tokenizationResponse: replenishmentOrder
        }, WorldlineRedirectTokenizationEvent);
      }
  })))), {
      strategy: CommandStrategy.CancelPrevious,
  });

  checkoutPreconditions(): Observable<[string, string, any]> {
    let browserData = {
        screenHeight: window.screen.height,
        screenWidth: window.screen.width,
        navigatorJavaEnabled: window.navigator.javaEnabled(),
        navigatorJavaScriptEnabled: true,
        timezoneOffsetUtcMinutes: new Date().getTimezoneOffset(),
        locale: window.navigator.language,
        userAgent: window.navigator.userAgent,
        acceptHeader: "application/json",
        colorDepth: window.screen.colorDepth,
      };
      return combineLatest([
          this.userIdService.takeUserId(),
          this.activeCartFacade.takeActiveCartId(),
          this.activeCartFacade.isGuestCart(),
      ]).pipe(take(1), map(([userId, cartId, isGuestCart]) => {
          if (!userId ||
              !cartId ||
              (userId === OCC_USER_ID_ANONYMOUS && !isGuestCart)) {
              throw new Error('Checkout conditions not met');
          }
          return [userId, cartId, browserData];
      }));
  }

    placeOrderHOP(termsChecked: any, orderType: ORDER_TYPE) {
      if (orderType == ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER) {
        return this.placeReplenishmentOrderHOPCommand.execute(termsChecked);
      } else {
        return this.placeOrderHOPCommand.execute(termsChecked);
      }
    }

    placeOrderHOPCommand = this.commandService.create((payload) => this.checkoutPreconditions().pipe(switchMap(([userId, cartId, browserData]) => this.getHostedCheckoutConnector.submitOrderHostedCheckout(userId, cartId, browserData).pipe(tap((hostedCheckoutResponse) => {
        if (hostedCheckoutResponse.hostedCheckoutId != null) {
          this.eventService.dispatch({
              hopResponse: hostedCheckoutResponse,
          }, WorldlineRedirectHOPEvent);
        }
    })))), {
        strategy: CommandStrategy.CancelPrevious,
    });

    placeReplenishmentOrderHOPCommand = this.commandService.create((payload) => this.checkoutPreconditions().pipe(switchMap(([userId, cartId, browserData]) => this.getHostedCheckoutConnector.submitReplenishmentHostedCheckout(userId, cartId, browserData).pipe(tap((hostedCheckoutResponse) => {
        if (hostedCheckoutResponse.hostedCheckoutId != null) {
          this.eventService.dispatch({
              hopResponse: hostedCheckoutResponse,
          }, WorldlineRedirectHOPEvent);
        }
    })))), {
        strategy: CommandStrategy.CancelPrevious,
    });

  placeOrderPayByLink(termsChecked: any, orderType: ORDER_TYPE) {
    return this.placeOrderPayByLinkCommand.execute(termsChecked);
  }

  placeOrderPayByLinkCommand = this.commandService.create((payload) => this.checkoutPreconditions().pipe(switchMap(([userId, cartId, browserData]) => this.payByLinkConnector.submit(userId, cartId).pipe(tap((order) => {
    if (order != null) {
      this.placedOrder$.next(order);
      this.eventService.dispatch({
        userId,
        cartId,
        cartCode: cartId,
        order: order,
      }, OrderPlacedEvent);
    }
  })))), {
    strategy: CommandStrategy.CancelPrevious,
  });

    getOrderDetails(): Observable<Order | undefined> {
       return this.placedOrder$.asObservable();
    }
    clearPlacedOrder(): void {
        this.placedOrder$.next(undefined);
    }
    setPlacedOrder(order: Order): void {
        this.placedOrder$.next(order);
    }
    getPickupEntries(): Observable<OrderEntry[]> {
        return this.getOrderDetails().pipe(map((order) => order?.entries?.filter((entry) => entry.deliveryPointOfService !== undefined) || []));
    }
    getDeliveryEntries(): Observable<OrderEntry[]> {
        return this.getOrderDetails().pipe(map((order) => order?.entries?.filter((entry) => entry.deliveryPointOfService === undefined) || []));
    }

  public submitTokenizationCheckout(userId: string, orderId: string, params: {
    RETURNMAC: string,
    REF: string,
    paymentId: string,
    cartId: string
  }) {
    let endpoint = this.occEndpoints.buildUrl("submitTokenizationCheckout", {
      urlParams: {userId, orderId},
      queryParams: {
        'RETURNMAC': params.RETURNMAC,
        'paymentId': params.paymentId,
        'REF': params.REF,
        'cartId': params.cartId
      },
    });
    return this.http.post<{ status: string }>(endpoint, {})
      .pipe(map(resp => {
          if (resp.status != 'REJECTED') {
            let order = this.converter.convert(resp, ORDER_NORMALIZER);

            this.subscriptions.add(this.eventService
                .get(OrderPlacedEvent)
                .subscribe(({ userId, cartId, cartCode }) => {
                this.eventService.dispatch({
                    userId,
                    cartId,
                    cartCode,
                }, RemoveCartEvent);
                this.eventService.dispatch({}, CheckoutQueryResetEvent);
            }));
            return {status: true, code: order.code};
          } else {
            return {status: false, reason: "REJECTED"};
          }
        }), catchError((error) =>
          of(new WorldlineActions.PlaceOrderFail(error))
        )
      );
  }

  public isTokenTemporary() {
    let userId, cartId;

        this.userIdService.getUserId().subscribe(occId => userId = occId).unsubscribe();
        this.activeCartFacade
          .getActiveCartId()
          .subscribe((activeCartId) => (cartId = activeCartId))
          .unsubscribe();
        return this.checkoutConnector.checkHTToken(userId,cartId);

  }
}
