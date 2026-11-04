import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {
  ConverterService,
  normalizeHttpError, SiteContextActions,
  withdrawOn
} from "@spartacus/core";
import { ORDER_NORMALIZER, REPLENISHMENT_ORDER_NORMALIZER } from '@spartacus/order/root';
import {Observable, of} from "rxjs";
import {catchError, map, mergeMap, switchMap} from "rxjs/operators";
import {WorldlineActions} from "../actions";
import {PlaceHostedCheckoutResponseConnector} from "../../connector/place-hosted-checkout-response.connector";
import {NON_AUTHORIZED_PAYMENT_STATUS} from "../../enums/worldline-enums";



@Injectable()
export class PlaceHostedCheckoutResponseEffect {

  private contextChange$ = this.actions$.pipe(
    ofType(
      SiteContextActions.CURRENCY_CHANGE,
      SiteContextActions.LANGUAGE_CHANGE
    )
  );

  placeHostedCheckoutResponse$ = createEffect(() => this.actions$.pipe(
    ofType(WorldlineActions.PLACE_HOSTED_CHECKOUT_RESPONSE_SUBMIT),
    map((action: any) => action.payload),
    mergeMap((payload) => {

      return this.placeHostedCheckoutResponseConnector
        .placeHostedCheckout(payload)
        .pipe(
          switchMap((data: any) => {
              if (data.status == NON_AUTHORIZED_PAYMENT_STATUS.REJECTED) {
                return [new WorldlineActions.PlaceHostedCheckoutResponseFail({})];
              } else if (data['status'] == NON_AUTHORIZED_PAYMENT_STATUS.CANCELLED) {
                return [new WorldlineActions.PlaceHostedCheckoutResponseCancel({})];
              } else {
                let result = this.converter.convert(data, payload.orderType ? ORDER_NORMALIZER : REPLENISHMENT_ORDER_NORMALIZER);
                return [new WorldlineActions.PlaceHostedCheckoutResponseSuccess(result)];
              }
            }
          ),
          catchError((error) =>
            of(new WorldlineActions.PlaceHostedCheckoutResponseFail(error))
          )
    )

    }),
    withdrawOn(this.contextChange$)
  ));

  constructor(protected placeHostedCheckoutResponseConnector: PlaceHostedCheckoutResponseConnector,
              private actions$: Actions,
              protected converter: ConverterService) {
  }
}
