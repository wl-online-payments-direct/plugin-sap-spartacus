import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { OccEndpointsService, StateWithProcess, UserIdService, EventService } from '@spartacus/core';
import {Order} from '@spartacus/order/root/model';
import { ORDER_TYPE, OrderPlacedEvent, ReplenishmentOrderScheduledEvent } from '@spartacus/order/root';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Token } from '../model/token.model';
import { TokenizationResult } from '../model/tokenization.model';
import { WorldlineActions } from '../store/actions';
import { StateWithWorldline } from '../store/worldline-state';
import { WorldlineSelectors } from '../store/selectors';
import { CheckoutQueryResetEvent } from '@spartacus/checkout/base/root';
import { ActiveCartFacade, RemoveCartEvent } from '@spartacus/cart/base/root';

@Injectable({
  providedIn: 'root'
})
export class TokenizationService {

  displaySavePaymentDetailsWarning$ = new BehaviorSubject<boolean>(false);
  subscriptions = new Subscription();
  constructor(protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected activeCartFacade: ActiveCartFacade,
    protected userIdService: UserIdService,
    protected store: Store<StateWithWorldline | StateWithProcess<void>>,
    protected eventService: EventService) {
    }

  public getToken() {
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

    let endpoint = this.occEndpoints.buildUrl('users/' + userId + "/carts/" + cartId + "/hostedTokenization");
    return this.http.get<Token>(endpoint);
  }

  public submit(orderType: ORDER_TYPE): void {
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
    return this.store.dispatch(new WorldlineActions.TokenizationSubmit({ userId, cartId, orderType }));
  }

  public submitOrder(order: Order): void {
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
    this.subscriptions.add(this.eventService
        .get(ReplenishmentOrderScheduledEvent)
        .subscribe(({ userId, cartId, cartCode }) => {
        this.eventService.dispatch({
            userId,
            cartId,
            cartCode,
        }, RemoveCartEvent);
        this.eventService.dispatch({}, CheckoutQueryResetEvent);
    }));
  }

  public getSubmitLoading(): Observable<boolean> {
    return this.store.pipe(select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.getTokenizationLoading(state as StateWithWorldline)));
  }

  public getSubmitSuccess(): Observable<boolean> {
    return this.store.pipe(select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.getTokenizationSuccess(state as StateWithWorldline)));
  }

  public getSubmitFail(): Observable<boolean> {
    return this.store.pipe(select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.getTokenizationFail(state as StateWithWorldline)));
  }

  public clearSubmitState(): void {
    this.store.dispatch(new WorldlineActions.ClearTokenizationSubmit());
  }

  public getSubmitData(): Observable<TokenizationResult> {
    return this.store.pipe(select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.getTokenizationResult(state as StateWithWorldline)));
  }

  public showMessage(value: boolean) {
    this.displaySavePaymentDetailsWarning$.next(value);
  }

  displayMessage = this.displaySavePaymentDetailsWarning$.asObservable();

}
