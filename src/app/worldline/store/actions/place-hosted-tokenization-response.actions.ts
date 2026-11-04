import {ORDER_TYPE} from "@spartacus/order/root";
import {StateUtils} from "@spartacus/core";
import { ReplenishmentOrder } from '@spartacus/order/root/model';
import {LoaderCancelAction} from "../../utils/loader";
import {Order} from "../../model/cart.model";

export const PLACE_HOSTED_TOKENIZATION_RESPONSE = "[WORLDLINE] place hosted tokenization response"
export const PLACE_HOSTED_TOKENIZATION_RESPONSE_SUBMIT = "[WORLDLINE] place hosted tokenization response submit";
export const PLACE_HOSTED_TOKENIZATION_RESPONSE_SUCCESS = "[WORLDLINE] place hosted tokenization response submit success";
export const PLACE_HOSTED_TOKENIZATION_RESPONSE_FAIL = "[WORLDLINE] place hosted tokenization response submit fail";
export const PLACE_HOSTED_TOKENIZATION_RESPONSE_CANCEL = "[WORLDLINE] place hosted tokenization response submit cancel";
export const CLEAR_PLACE_HOSTED_TOKENIZATION_RESPONSE_SUBMIT = "[WORLDLINE] Clear place hosted tokenization response submit";

export class PlaceHostedTokenizationResponseSubmit extends StateUtils.LoaderLoadAction {
  override readonly type = PLACE_HOSTED_TOKENIZATION_RESPONSE_SUBMIT;

  constructor(public payload: {
    userId: string, orderOrReplenishmentCode: string, orderType: ORDER_TYPE, params: {
      RETURNMAC: string,
      REF: string,
      paymentId: string,
      cartId: string
    }
  }) {
    super(PLACE_HOSTED_TOKENIZATION_RESPONSE);
  }

}

export class PlaceHostedTokenizationResponseSuccess extends StateUtils.LoaderSuccessAction {
  override readonly type = PLACE_HOSTED_TOKENIZATION_RESPONSE_SUCCESS;

  constructor(public payload: Order | ReplenishmentOrder) {
    super(PLACE_HOSTED_TOKENIZATION_RESPONSE)
  }
}

export class PlaceHostedTokenizationResponseFail extends StateUtils.LoaderFailAction {
  override readonly type = PLACE_HOSTED_TOKENIZATION_RESPONSE_FAIL;

  constructor(public payload: any) {
    super(PLACE_HOSTED_TOKENIZATION_RESPONSE, payload)
  }
}

export class PlaceHostedTokenizationResponseCancel extends LoaderCancelAction {
  override readonly type = PLACE_HOSTED_TOKENIZATION_RESPONSE_CANCEL;

  constructor(public payload: any) {
    super(PLACE_HOSTED_TOKENIZATION_RESPONSE, payload)
  }
}

export class ClearPlaceHostedTokenizationResponse extends StateUtils.LoaderResetAction {
  override readonly type = CLEAR_PLACE_HOSTED_TOKENIZATION_RESPONSE_SUBMIT;

  constructor() {
    super(PLACE_HOSTED_TOKENIZATION_RESPONSE);
  }
}

export type PlaceHostedTokenizationResponseSubmitAction =
  PlaceHostedTokenizationResponseSubmit
  | PlaceHostedTokenizationResponseFail
  | PlaceHostedTokenizationResponseSuccess
  | ClearPlaceHostedTokenizationResponse
  | PlaceHostedTokenizationResponseCancel;
