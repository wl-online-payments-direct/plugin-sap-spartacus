import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {normalizeHttpError, SiteContextActions, withdrawOn} from "@spartacus/core";
import { ORDER_TYPE } from '@spartacus/order/root';
import {Observable, of} from "rxjs";
import {catchError, map, mergeMap, switchMap} from "rxjs/operators";
import {WorldlineActions} from "../actions";
import {GetHostedCheckoutConnector} from "../../connector/get-hosted-checkout.connector";

@Injectable()
export class GetHostedCheckoutEffect {
  private contextChange$ = this.actions$.pipe(
    ofType(
      SiteContextActions.CURRENCY_CHANGE,
      SiteContextActions.LANGUAGE_CHANGE
    )
  );

  constructor(protected getHostedCheckoutConnector: GetHostedCheckoutConnector, private actions$: Actions) {
  }

  getHostedCheckout$ = createEffect(() => this.actions$.pipe(
    ofType(WorldlineActions.GET_HOSTED_CHECKOUT_SUBMIT),
    map((action: any) => action.payload),
    mergeMap((payload) => {
      switch (payload.orderType) {
        case ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER: {
          return this.getHostedCheckoutConnector
            .submitReplenishmentHostedCheckout(payload.userId, payload.cartId, payload.body)
            .pipe(
              switchMap((data) => [
                new WorldlineActions.GetHostedCheckoutSuccess(data)
              ]),
              catchError((error) =>
                of(new WorldlineActions.GetHostedCheckoutFail(error))
              )
            );
        }
        case ORDER_TYPE.PLACE_ORDER:
        default: {
          return this.getHostedCheckoutConnector
            .submitOrderHostedCheckout(payload.userId, payload.cartId, payload.body)
            .pipe(
              switchMap((data) => [
                new WorldlineActions.GetHostedCheckoutSuccess(data)
              ]),
              catchError((error) =>
                of(new WorldlineActions.GetHostedCheckoutFail(error))
              )
            );
        }
      }
    }),
    withdrawOn(this.contextChange$)
  ));
}
