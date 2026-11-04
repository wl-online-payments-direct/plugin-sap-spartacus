import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from '@ngrx/store';
import { normalizeHttpError, PaymentDetails } from "@spartacus/core";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { PaymentMethodConnector } from "../../connector/payment-method.connector";
import { WorldlineActions } from "../actions";

@Injectable()
export class PaymentMethodsEffects {
    constructor(
        private actions$: Actions,
        private paymentMethodsConnector: PaymentMethodConnector
    ) { }

    loadPaymentMethods$ = createEffect(() => this.actions$.pipe(
        ofType(WorldlineActions.LOAD_PAYMENT_METHOD),
        map((action: WorldlineActions.LoadPaymentMethods) => action.payload),
        mergeMap((payload) => {
            return this.paymentMethodsConnector.getAll(payload.userId, payload.cartId).pipe(
                map((payments: PaymentDetails[]) => {
                    return new WorldlineActions.LoadPaymentMethodsSuccess(payments);
                }),
                catchError((error) =>
                    of(
                        new WorldlineActions.LoadUserPaymentMethodsFail(error)
                    )
                )
            );
        })
    ));

    setDefaultUserPaymentMethod$ = createEffect(() => this.actions$.pipe(
        ofType(WorldlineActions.SET_PAYMENT_METHOD),
        map((action: WorldlineActions.SetPaymentMethod) => action.payload),
        mergeMap((payload) => {
            return this.paymentMethodsConnector.setMethod(payload.userId, payload.cartId, payload.hostedTokenizationId,payload.savedCardCode, payload.methodId, payload.googlePayEncryptedPaymentData, payload.address)
                .pipe(
                    switchMap((data) => of(new WorldlineActions.SetPaymentMethodSuccess(data))),
                    catchError((error) => of(new WorldlineActions.SetPaymentMethodSuccess(error)) //TODO change to error
                    )
                );
        })
    ));
}
