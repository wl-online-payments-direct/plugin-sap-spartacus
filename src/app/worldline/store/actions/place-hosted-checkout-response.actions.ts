import {ORDER_TYPE} from "@spartacus/order/root";
import { StateUtils } from "@spartacus/core";
import { ReplenishmentOrder } from '@spartacus/order/root/model';
import {LoaderCancelAction} from "../../utils/loader";
import {Order} from "../../model/cart.model";

export const PLACE_HOSTED_CHECKOUT_RESPONSE = "[WORLDLINE] place hosted checkout response"
export const PLACE_HOSTED_CHECKOUT_RESPONSE_SUBMIT = "[WORLDLINE] place hosted checkout response submit";
export const PLACE_HOSTED_CHECKOUT_RESPONSE_SUCCESS = "[WORLDLINE] place hosted checkout response submit success";
export const PLACE_HOSTED_CHECKOUT_RESPONSE_FAIL = "[WORLDLINE] place hosted checkout response submit fail";
export const PLACE_HOSTED_CHECKOUT_RESPONSE_CANCEL = "[WORLDLINE] place hosted checkout response submit cancel";
export const CLEAR_PLACE_HOSTED_CHECKOUT_RESPONSE_SUBMIT = "[WORLDLINE] Clear place hosted checkout response submit";

export class PlaceHostedCheckoutResponseSubmit extends StateUtils.LoaderLoadAction {
  override readonly type = PLACE_HOSTED_CHECKOUT_RESPONSE_SUBMIT;

  constructor(public payload: {
    userId: string, orderOrReplenishmentCode: string, orderType: ORDER_TYPE, params:
      {
        RETURNMAC: string,
        hostedCheckoutId: string,
        cartId: string
      }
  }) {
    super(PLACE_HOSTED_CHECKOUT_RESPONSE);
  }

}

export class PlaceHostedCheckoutResponseSuccess extends StateUtils.LoaderSuccessAction {
  override readonly type = PLACE_HOSTED_CHECKOUT_RESPONSE_SUCCESS;

  constructor(public payload: Order | ReplenishmentOrder) {
    super(PLACE_HOSTED_CHECKOUT_RESPONSE)
  }
}

export class PlaceHostedCheckoutResponseFail extends StateUtils.LoaderFailAction {
  override readonly type = PLACE_HOSTED_CHECKOUT_RESPONSE_FAIL;

  constructor(public payload: any) {
    super(PLACE_HOSTED_CHECKOUT_RESPONSE, payload)
  }
}

export class PlaceHostedCheckoutResponseCancel extends LoaderCancelAction {
  override readonly type = PLACE_HOSTED_CHECKOUT_RESPONSE_CANCEL;

  constructor(public payload: any) {
    super(PLACE_HOSTED_CHECKOUT_RESPONSE, payload)
  }
}

export class ClearPlaceHostedCheckoutResponse extends StateUtils.LoaderResetAction {
  override readonly type = CLEAR_PLACE_HOSTED_CHECKOUT_RESPONSE_SUBMIT;

  constructor() {
    super(PLACE_HOSTED_CHECKOUT_RESPONSE);
  }
}

export type PlaceHostedCheckoutResponseSubmitAction =
  PlaceHostedCheckoutResponseSubmit
  | PlaceHostedCheckoutResponseFail
  | PlaceHostedCheckoutResponseSuccess
  | ClearPlaceHostedCheckoutResponse
  | PlaceHostedCheckoutResponseCancel;
