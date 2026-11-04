import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {Address, StateWithProcess, UserIdService} from '@spartacus/core';
import {Observable} from 'rxjs';
import { PaymentProduct } from '../model/payment.model';
import { WorldlineActions } from '../store/actions';
import { StateWithWorldline } from '../store/worldline-state';
import { WorldlineSelectors } from '../store/selectors';
import {HttpClient} from "@angular/common/http";
import {PaymentMethodConnector} from "../connector/payment-method.connector";
import { ActiveCartFacade } from '@spartacus/cart/base/root';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  constructor(protected http: HttpClient,
              protected store: Store<StateWithWorldline | StateWithProcess<void>>,
              protected activeCartFacade: ActiveCartFacade,
              protected userIdService: UserIdService,
              protected paymentMethodsConnector: PaymentMethodConnector) { }

  public getPaymentMethodsLoading(): Observable<boolean> {
    return this.store.pipe(select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.getPaymentMethodsLoading(state as StateWithWorldline)));
  }

  public loadPaymentMethods(): void {
    let userId, cartId;

    this.userIdService.getUserId().subscribe(occId => userId = occId).unsubscribe();
    this.activeCartFacade.getActiveCartId().subscribe(occId => cartId = occId).unsubscribe();

    this.store.dispatch(new WorldlineActions.LoadPaymentMethods({ userId, cartId }));
  }

  public getPaymentMethods(): Observable<PaymentProduct[]> {
    return this.store.pipe(select((state: StateWithWorldline | StateWithProcess<void>) => WorldlineSelectors.getPaymentMethods(state as StateWithWorldline)));
  }

  public setPaymentMethod(methodId: string, hostedTokenizationId: string, savedCardCode: string, googlePayEncryptedPaymentData: string, address: Address): Observable<{}> {
    let userId, cartId;

    this.userIdService.getUserId().subscribe(occId => userId = occId).unsubscribe();
    this.activeCartFacade.getActiveCartId().subscribe(occId => cartId = occId).unsubscribe();
    return this.paymentMethodsConnector.setMethod(userId, cartId, hostedTokenizationId, savedCardCode, methodId, googlePayEncryptedPaymentData, address);
  }

  public getGooglePayData(): Observable<{}> {
    let userId, cartId;

    this.userIdService.getUserId().subscribe(occId => userId = occId).unsubscribe();
    this.activeCartFacade.getActiveCartId().subscribe(occId => cartId = occId).unsubscribe();

    return this.paymentMethodsConnector.getGooglePay(userId, cartId);
  }


  public clearPaymentMethods(): void {
    this.store.dispatch(new WorldlineActions.ClearPaymentMethods({}));
  }

}
