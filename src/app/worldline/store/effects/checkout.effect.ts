import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { GlobalMessageActions, normalizeHttpError, SiteContextActions, withdrawOn } from "@spartacus/core";
import {CartActions} from '@spartacus/cart/base/core';
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { CheckoutConnector } from "../../connector/checkout.connector";
import { PaymentInfoConnector } from "../../connector/cart.connector";
import { WorldlineActions } from "../actions";
@Injectable()
export class CheckoutEffects {
    private contextChange$ = this.actions$.pipe(
        ofType(
            SiteContextActions.CURRENCY_CHANGE,
            SiteContextActions.LANGUAGE_CHANGE
        )
    );

    constructor(
        private actions$: Actions,
        private checkoutConnector: CheckoutConnector,
        private paymentInfoConnector: PaymentInfoConnector
    ) { }

    loadPaymentInfo$ = createEffect(() => this.actions$.pipe(
        ofType(WorldlineActions.LOAD_PAYMENT_INFO),
        map((action: any) => action.payload),
        mergeMap((payload) => {
            return this.paymentInfoConnector.load(payload.userId, payload.cartId)
                .pipe(switchMap((data) => [new WorldlineActions.LoadWorldlinePaymentInfoSuccess(data)]))//,TODO: Logging catchError((error) => of(new WorldlineActions.LoadUserPaymentMethodsFail(normalizeHttpError(error)))))
        }),
        withdrawOn(this.contextChange$)
    ));

    placeOrder$ = createEffect(() => this.actions$.pipe(
        ofType(WorldlineActions.PLACE_ORDER),
        map((action: any) => action.payload),
        mergeMap((payload) => {
            return this.checkoutConnector
                .placeOrder(payload.userId, payload.cartId, payload.termsChecked)
                .pipe(
                    switchMap((data) => [
                        new WorldlineActions.PlaceOrderSuccess(data),
                    ]),
                    catchError((error) =>
                        of(new WorldlineActions.PlaceOrderFail(error))
                    )
                );
        }),
        withdrawOn(this.contextChange$)
    ));
}
