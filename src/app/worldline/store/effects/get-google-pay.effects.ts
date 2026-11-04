import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { normalizeHttpError, SiteContextActions, withdrawOn } from "@spartacus/core";
import { ORDER_TYPE, OrderPlacedEvent } from '@spartacus/order/root';
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { GooglePayConnector } from "../../connector/google-pay.connector";
import { TokenizationResult } from "../../model/tokenization.model";
import { WorldlineActions } from "../actions";
import { EventService } from '@spartacus/core';
import {GOOGLE_PAY_SUBMIT, GooglePaySubmitFail, GooglePaySubmitSuccess} from "../actions/get-google-pay.actions";

@Injectable()
export class GetGooglePayEffect {
  private contextChange$ = this.actions$.pipe(
    ofType(
      SiteContextActions.CURRENCY_CHANGE,
      SiteContextActions.LANGUAGE_CHANGE
    )
  );

  constructor(protected googlePayConnector: GooglePayConnector, private actions$: Actions, protected eventService: EventService) { }

  submitToken$ = createEffect(() => this.actions$.pipe(
    ofType(WorldlineActions.GOOGLE_PAY_SUBMIT),
    map((action: any) => action.payload),
    mergeMap((payload) => {
      if (payload.cartId) {
        switch (payload.orderType) {
          case ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER: {
            return this.googlePayConnector
              .submitReplenishmentOrder(payload.userId, payload.cartId)
              .pipe(
                switchMap((data) => {

                    return [new WorldlineActions.GooglePaySubmitSuccess(data)]
                  }
                ),
                catchError((error) =>
                  of(new WorldlineActions.GooglePaySubmitFail(error))
                )
              );
          }
          case ORDER_TYPE.PLACE_ORDER:
          default: {

            let userId = payload.userId;
            let cartId = payload.cartId;
            return this.googlePayConnector
              .submit(payload.userId, payload.cartId)
              .pipe(
                switchMap((data) => {
                  let order = data.order;
                  this.eventService.dispatch({
                    userId,
                    cartId,
                    cartCode: cartId,
                    order
                  }, OrderPlacedEvent)
                  return [new WorldlineActions.GooglePaySubmitSuccess(data)]
                }),
                catchError((error) =>
                  of(new WorldlineActions.GooglePaySubmitFail(error))
                )
              );
          }
        }
      } else {
        return of(new WorldlineActions.GooglePaySubmitFail("No cardId was provided."));
      }

    }),
    withdrawOn(this.contextChange$)
  ));
}
