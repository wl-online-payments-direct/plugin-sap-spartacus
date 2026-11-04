import { StateUtils } from "@spartacus/core";
import { ORDER_TYPE } from '@spartacus/order/root';
import { TokenizationResult } from '../../model/tokenization.model';

export const GOOGLE_PAY = "[WORLDLINE] GooglePay"
export const GOOGLE_PAY_SUBMIT = "[WORLDLINE] GooglePay submit";
export const GOOGLE_PAY_SUBMIT_SUCCESS = "[WORLDLINE] GooglePay submit success";
export const GOOGLE_PAY_SUBMIT_FAIL = "[WORLDLINE] GooglePay submit fail";
export const GOOGLE_PAY_SUBMIT_LOADING = "[WORLDLINE] GooglePay submit loading";

export const CLEAR_GOOGLE_PAY_SUBMIT = "[WORLDLINE] Clear googlePay submit";

export class GooglePaySubmit extends StateUtils.LoaderLoadAction {
  override readonly type = GOOGLE_PAY_SUBMIT;

  constructor(public payload: { userId: string, cartId: string, orderType:ORDER_TYPE }) {
    super(GOOGLE_PAY);
  }

}

export class GooglePaySubmitSuccess extends StateUtils.LoaderSuccessAction {
  override readonly type = GOOGLE_PAY_SUBMIT_SUCCESS;

  constructor(public payload: TokenizationResult) {
    super(GOOGLE_PAY)
  }
}

export class GooglePaySubmitFail extends StateUtils.LoaderFailAction {
  override readonly type = GOOGLE_PAY_SUBMIT_FAIL;

  constructor(public payload: any) {
    super(GOOGLE_PAY, payload)
  }
}

export class ClearGooglePaySubmit extends StateUtils.LoaderResetAction {
  override readonly type = CLEAR_GOOGLE_PAY_SUBMIT;
  constructor() {
    super(GOOGLE_PAY);
  }
}

export type GooglePaySumitAction = GooglePaySubmit | GooglePaySubmitFail | GooglePaySubmitSuccess
  | ClearGooglePaySubmit;
