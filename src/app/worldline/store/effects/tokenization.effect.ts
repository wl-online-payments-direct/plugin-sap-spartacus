import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { normalizeHttpError, SiteContextActions, withdrawOn } from "@spartacus/core";
import { ORDER_TYPE, OrderPlacedEvent } from '@spartacus/order/root';
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { TokenizationConnector } from "../../connector/tokenization.connector";
import { TokenizationResult } from "../../model/tokenization.model";
import { WorldlineActions } from "../actions";
import { EventService } from '@spartacus/core';

@Injectable()
export class TokenizationEffect {
    private contextChange$ = this.actions$.pipe(
        ofType(
            SiteContextActions.CURRENCY_CHANGE,
            SiteContextActions.LANGUAGE_CHANGE
        )
    );

    constructor(protected tokenizationConnector: TokenizationConnector, private actions$: Actions, protected eventService: EventService) { }

    submitToken$ = createEffect(() => this.actions$.pipe(
        ofType(WorldlineActions.TOKENIZATION_SUBMIT),
        map((action: any) => action.payload),
        mergeMap((payload) => {
          if (payload.cartId) {
            switch (payload.orderType) {
              case ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER: {
                return this.tokenizationConnector
                  .submitReplenishmentOrder(payload.userId, payload.cartId)
                  .pipe(
                      switchMap((data) => {

                        return [new WorldlineActions.TokenizationSubmitSuccess(data)]
                      }
                      ),
                      catchError((error) =>
                          of(new WorldlineActions.TokenizationSubmitFail(error))
                      )
                  );
              }
              case ORDER_TYPE.PLACE_ORDER:
              default: {

               let userId = payload.userId;
               let cartId = payload.cartId;
               return this.tokenizationConnector
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
                      return [new WorldlineActions.TokenizationSubmitSuccess(data)]
                     }),
                     catchError((error) =>
                         of(new WorldlineActions.TokenizationSubmitFail(error))
                     )
                 );
              }
            }
          } else {
            return of(new WorldlineActions.TokenizationSubmitFail("No cardId was provided."));
          }

        }),
        withdrawOn(this.contextChange$)
    ));
}
