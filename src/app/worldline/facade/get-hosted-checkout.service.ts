import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import { ConverterService,
  OccEndpointsService,
  StateWithProcess,
  UserIdService
} from '@spartacus/core';
import {ScheduleReplenishmentForm} from '@spartacus/order/root/model/scheduled-replenishment.model';
import { ORDER_TYPE } from '@spartacus/order/root';
import {Observable} from 'rxjs';
import {WorldlineActions} from '../store/actions';
import {StateWithWorldline} from '../store/worldline-state';
import {WorldlineSelectors} from '../store/selectors';
import {HostedCheckout} from "../model/payment.model";
import {WORLDLINE_REPLENISHMENT_ORDER_FORM_SERIALIZER} from "../converter/converters";
import { ActiveCartFacade } from '@spartacus/cart/base/root';

@Injectable({
  providedIn: 'root'
})
export class GetHostedCheckoutService {

  constructor(protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected activeCartFacade: ActiveCartFacade,
    protected userIdService: UserIdService,
    protected converter: ConverterService,
    protected store: Store<StateWithWorldline>) { }


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
    return this.store.dispatch(new WorldlineActions.GetHostedCheckoutSubmit({userId, cartId, orderType, body: browserData}));
  }

  public getSubmitSuccess(): Observable<boolean> {
    return this.store.pipe(select(WorldlineSelectors.getHostedCheckoutSuccess));
  }

  public getSubmitFail(): Observable<boolean> {
    return this.store.pipe(select(WorldlineSelectors.getHostedCheckoutFail));
  }

  public clearSubmitState(): void {
    this.store.dispatch(new WorldlineActions.ClearGetHostedCheckout());
  }

  public getSubmitData(): Observable<HostedCheckout> {
    return this.store.pipe(select(WorldlineSelectors.getHostedCheckoutResult));
  }

}
