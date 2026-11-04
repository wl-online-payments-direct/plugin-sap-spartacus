import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {
  ConverterService,
  normalizeHttpError, SiteContextActions,
  withdrawOn
} from "@spartacus/core";
import { ORDER_TYPE, ORDER_NORMALIZER, REPLENISHMENT_ORDER_NORMALIZER } from '@spartacus/order/root';
import {Observable, of} from "rxjs";
import {catchError, map, mergeMap, switchMap} from "rxjs/operators";
import {WorldlineActions} from "../actions";
import {PlaceHostedTokenizationResponseConnector} from "../../connector/place-hosted-tokenization-response.connector";
import {NON_AUTHORIZED_PAYMENT_STATUS} from "../../enums/worldline-enums";


@Injectable()
export class PlaceHostedTokenizationResponseEffect {

  private contextChange$ = this.actions$.pipe(
    ofType(
      SiteContextActions.CURRENCY_CHANGE,
      SiteContextActions.LANGUAGE_CHANGE
    )
  );
  placeHostedTokenizationResponse$ = createEffect(() => this.actions$.pipe(
    ofType(WorldlineActions.PLACE_HOSTED_TOKENIZATION_RESPONSE_SUBMIT),
    map((action: any) => action.payload),
    mergeMap((payload: {
      userId: string,
      orderOrReplenishmentCode: string,
      orderType: ORDER_TYPE,
      params: {
        RETURNMAC: string,
        REF: string,
        paymentId: string,
        cartId: string
      }
    }) => {

      return this.placeHostedTokenizationResponseConnector
        .placeHostedTokenization(payload)
        .pipe(
          switchMap((data: any) => {
              if (data['status'] == NON_AUTHORIZED_PAYMENT_STATUS.REJECTED) {
                return [new WorldlineActions.PlaceHostedTokenizationResponseFail({})];
              } else if (data['status'] == NON_AUTHORIZED_PAYMENT_STATUS.CANCELLED) {
                return [new WorldlineActions.PlaceHostedTokenizationResponseCancel({})];
              } else {
                let result = this.converter.convert(data, payload.orderType ? ORDER_NORMALIZER : REPLENISHMENT_ORDER_NORMALIZER);
                return [new WorldlineActions.PlaceHostedTokenizationResponseSuccess(result)];
              }
            }
          ),
          catchError((error) =>
            of(new WorldlineActions.PlaceHostedTokenizationResponseFail(error))
          )
        )

    }),
    withdrawOn(this.contextChange$)
  ));

  constructor(protected placeHostedTokenizationResponseConnector: PlaceHostedTokenizationResponseConnector,
              private actions$: Actions,
              protected converter: ConverterService) {
  }
}
