import { InjectionToken, Provider } from "@angular/core";
import { Action, ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import {AuthActions} from "@spartacus/core";
import { ReplenishmentOrder } from '@spartacus/order/root/model'
import {CheckoutMethod, HostedCheckout, PaymentProduct} from "../../model/payment.model";
import { loaderReducer } from "../../utils/loader";
import { CHECKOUT_METHODS, WorldlineState, PAYMENT_METHODS } from "../worldline-state";
import * as fromPaymentReducer from './payment-methods.reducer';
import * as fromCheckoutReducer from './checkout.reducer';
import * as fromTokenizationSubmitReducer from './tokenization-submit.reducer';
import * as fromPaymentInfoReducer from './payment-info.reducer';
import * as fromGetHostedCheckoutReducer from './get-hosted-checkout.reducer';
import * as fromPlaceHostedCheckoutResponseReducer from './place-hosted-checkout-response.reducer';
import * as fromPlaceHostedTokenizationResponseReducer from './place-hosted-tokenization-response.reducer';
import { TokenizationResult } from "../../model/tokenization.model";
import { TOKENIZATION } from "../actions/tokenization.actions";
import {Order, WorldlinePaymentInfo} from "../../model/cart.model";
import { LOAD_PAYMENT_INFO } from "../actions/checkout.actions";
import {GET_HOSTED_CHECKOUT} from "../actions/get-hosted-checkout.actions";
import {PLACE_HOSTED_CHECKOUT_RESPONSE} from "../actions/place-hosted-checkout-response.actions";
import {PLACE_HOSTED_TOKENIZATION_RESPONSE} from "../actions/place-hosted-tokenization-response.actions";

export const reducerToken: InjectionToken<ActionReducerMap<WorldlineState>> = new InjectionToken<ActionReducerMap<WorldlineState>>('WorldlineReducers');

export function clearUserState(reducer: ActionReducer<any>): ActionReducer<any> {
    return function (state, action) {
        if (action.type === AuthActions.LOGOUT) {
            state = undefined;
        }

        return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<any>[] = [clearUserState];

export function getReducers(): ActionReducerMap<WorldlineState> {
    return {
      paymentMethods: loaderReducer<PaymentProduct[]>(PAYMENT_METHODS, fromPaymentReducer.reducer as ActionReducer<PaymentProduct[], Action>),
      checkoutMethod: loaderReducer<CheckoutMethod>(CHECKOUT_METHODS, fromCheckoutReducer.reducer as ActionReducer<CheckoutMethod, Action>),
      tokenizationResult: loaderReducer<TokenizationResult>(TOKENIZATION, fromTokenizationSubmitReducer.reducer as ActionReducer<TokenizationResult, Action>),
      paymentInfo: loaderReducer<WorldlinePaymentInfo>(LOAD_PAYMENT_INFO, fromPaymentInfoReducer.reducer as ActionReducer<WorldlinePaymentInfo, Action>),
      getHostedCheckout: loaderReducer<HostedCheckout>(GET_HOSTED_CHECKOUT, fromGetHostedCheckoutReducer.reducer as ActionReducer<HostedCheckout, Action>),
      placeHostedCheckoutResponse: loaderReducer<Order | ReplenishmentOrder>(PLACE_HOSTED_CHECKOUT_RESPONSE, fromPlaceHostedCheckoutResponseReducer.reducer as ActionReducer<Order | ReplenishmentOrder, Action>),
      placeHostedTokenizationResponse: loaderReducer<Order | ReplenishmentOrder>(PLACE_HOSTED_TOKENIZATION_RESPONSE, fromPlaceHostedTokenizationResponseReducer.reducer as ActionReducer<Order | ReplenishmentOrder, Action>)
    };
};

export const reducerProvider: Provider = {
    provide: reducerToken,
    useFactory: getReducers,
};
