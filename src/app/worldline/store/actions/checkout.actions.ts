import {Address, PaymentDetails, StateUtils} from "@spartacus/core";
import {WorldlinePaymentInfo} from "../../model/cart.model";
import {CheckoutMethod} from "../../model/payment.model";
import {PAYMENT_METHODS, CHECKOUT_METHODS, CART_LOAD_METHODS} from "../worldline-state";

export const LOAD_PAYMENT_INFO = '[WORLDLINE] Load payment info';
export const LOAD_PAYMENT_INFO_SUCCESS = '[WORLDLINE] Load payment info success';
export const LOAD_PAYMENT_INFO_FAIL = '[WORLDLINE] Load payment info fail';
export const PLACE_ORDER = '[WORLDLINE] Place order';
export const PLACE_ORDER_SUCCESS = "[WORLDLINE] Place order success";
export const PLACE_ORDER_FAIL = "[WORLDLINE] Place order fail";
export const RESET_ORDER = '[WORLDLINE] Reset order';
export const LOAD_PAYMENT_METHOD = '[WORLDLINE] Load payment method';
export const LOAD_PAYMENT_METHODS_SUCCESS = "[WORLDLINE] Load payment method success";
export const LOAD_PAYMENT_METHODS_FAIL = "[WORLDLINE] Load payment method fail";
export const LOAD_PAYMENT_METHODS_RESET = "[WORLDLINE] Reset payment method";
export const SET_PAYMENT_METHOD = '[WORLDLINE] Set payment method';
export const SET_PAYMENT_METHOD_SUCCESS = '[WORLDLINE] Set payment method success';

export class LoadWorldlinePaymentInfo extends StateUtils.LoaderLoadAction {
  override readonly type = LOAD_PAYMENT_INFO;

  constructor(public payload: { userId: string; cartId: string }) {
    super(CART_LOAD_METHODS);
  }
}

export class LoadWorldlinePaymentInfoSuccess extends StateUtils.LoaderSuccessAction {
  override readonly type = LOAD_PAYMENT_INFO_SUCCESS;

  constructor(public payload: WorldlinePaymentInfo) {
    super(CART_LOAD_METHODS);
  }
}


export class LoadWorldlinePaymentInfoFail extends StateUtils.LoaderFailAction {
  override readonly type = LOAD_PAYMENT_INFO_FAIL;

  constructor(public payload: any) {
    super(CART_LOAD_METHODS, payload);
  }
}

export class ResetOrder extends StateUtils.LoaderResetAction {
  override readonly type = RESET_ORDER;

  constructor() {
    super(CHECKOUT_METHODS);
  }
}

export class PlaceOrder extends StateUtils.LoaderLoadAction {
  override readonly type = PLACE_ORDER;

  constructor(public payload: { userId: string; cartId: string; termsChecked: boolean }) {
    super(CHECKOUT_METHODS);
  }
}

export class PlaceOrderSuccess extends StateUtils.LoaderSuccessAction {
  override readonly type = PLACE_ORDER_SUCCESS;

  constructor(public payload: CheckoutMethod) {
    super(CHECKOUT_METHODS);
  }
}

export class PlaceOrderFail extends StateUtils.LoaderFailAction {
  override readonly type = PLACE_ORDER_FAIL;

  constructor(public payload: any) {
    super(CHECKOUT_METHODS, payload);
  }
}

export class LoadPaymentMethods extends StateUtils.LoaderLoadAction {
  override readonly type = LOAD_PAYMENT_METHOD;

  constructor(public payload: {
    userId: string, cartId: string
  }) {
    super(PAYMENT_METHODS)
  }
}

export class LoadPaymentMethodsSuccess extends StateUtils.LoaderSuccessAction {
  override readonly type = LOAD_PAYMENT_METHODS_SUCCESS;

  constructor(public payload: PaymentDetails[]) {
    super(PAYMENT_METHODS);
  }
}

export class LoadUserPaymentMethodsFail extends StateUtils.LoaderFailAction {
  override readonly type = LOAD_PAYMENT_METHODS_FAIL;

  constructor(public payload: any) {
    super(PAYMENT_METHODS, payload);
  }
}

export class ClearPaymentMethods extends StateUtils.LoaderResetAction {
  override readonly type = LOAD_PAYMENT_METHODS_RESET;

  constructor(public payload: any) {
    super(PAYMENT_METHODS);
  }
}

export class SetPaymentMethod extends StateUtils.EntityLoadAction {
  override readonly type = SET_PAYMENT_METHOD;

  constructor(public payload: {
    userId: string, cartId: string, methodId: string, issuerId: string, address: Address
    hostedTokenizationId: string
    savedCardCode: string,
    googlePayEncryptedPaymentData: string
  }) {
    super(PAYMENT_METHODS, SET_PAYMENT_METHOD)
  }
}

export class SetPaymentMethodSuccess extends StateUtils.LoaderSuccessAction {
  override readonly type = SET_PAYMENT_METHOD_SUCCESS;

  constructor(public payload: any) {
    super(PAYMENT_METHODS);
  }
}

export type PaymentMethodsAction =
  LoadPaymentMethods
  | LoadPaymentMethodsSuccess
  | LoadUserPaymentMethodsFail
  | SetPaymentMethod
  | SetPaymentMethodSuccess
  | ClearPaymentMethods;

export type CheckoutAction = PlaceOrder | PlaceOrderFail | PlaceOrderSuccess;

export type PaymentInfoAction = LoadWorldlinePaymentInfo | LoadWorldlinePaymentInfoSuccess | LoadUserPaymentMethodsFail;
