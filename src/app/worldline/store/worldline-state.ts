import {StateUtils} from "@spartacus/core";
import { ReplenishmentOrder } from '@spartacus/order/root/model';
import {Order, WorldlinePaymentInfo} from "../model/cart.model";
import {CheckoutMethod, HostedCheckout, PaymentProduct} from "../model/payment.model";
import { TokenizationResult } from "../model/tokenization.model";


export const WORLDLINE_FEATURE = "worldline";
export const PAYMENT_METHODS = "[Worldline] Payment methods";
export const CHECKOUT_METHODS = "[Worldline] Payment methods";
export const CART_LOAD_METHODS = "[Worldline] Load cart methods";

export interface StateWithWorldline {
    [WORLDLINE_FEATURE]: WorldlineState;
}

export interface WorldlineState {
    paymentMethods: StateUtils.LoaderState<PaymentProduct[]>;
    checkoutMethod: StateUtils.LoaderState<CheckoutMethod>;
    tokenizationResult: StateUtils.LoaderState<TokenizationResult>;
    getHostedCheckout:StateUtils.LoaderState<HostedCheckout>
    paymentInfo: StateUtils.LoaderState<WorldlinePaymentInfo>;
    placeHostedCheckoutResponse: StateUtils.LoaderState<Order | ReplenishmentOrder>;
    placeHostedTokenizationResponse: StateUtils.LoaderState<Order | ReplenishmentOrder>;
}
