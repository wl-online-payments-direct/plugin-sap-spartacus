import { StateUtils } from "@spartacus/core";
import { ORDER_TYPE } from '@spartacus/order/root';
import { TokenizationResult } from '../../model/tokenization.model';

export const TOKENIZATION = "[WORLDLINE] Tokenization"
export const TOKENIZATION_SUBMIT = "[WORLDLINE] Tokenization submit";
export const TOKENIZATION_SUBMIT_SUCCESS = "[WORLDLINE] Tokenization submit success";
export const TOKENIZATION_SUBMIT_FAIL = "[WORLDLINE] Tokenization submit fail";
export const TOKENIZATION_SUBMIT_LOADING = "[WORLDLINE] Tokenization submit loading";

export const CLEAR_TOKENIZATION_SUBMIT = "[WORLDLINE] Clear tokenization submit";

export class TokenizationSubmit extends StateUtils.LoaderLoadAction {
    override readonly type = TOKENIZATION_SUBMIT;

    constructor(public payload: { userId: string, cartId: string, orderType:ORDER_TYPE }) {
        super(TOKENIZATION);
    }

}

export class TokenizationSubmitSuccess extends StateUtils.LoaderSuccessAction {
  override readonly type = TOKENIZATION_SUBMIT_SUCCESS;

    constructor(public payload: TokenizationResult) {
        super(TOKENIZATION)
    }
}

export class TokenizationSubmitFail extends StateUtils.LoaderFailAction {
  override readonly type = TOKENIZATION_SUBMIT_FAIL;

    constructor(public payload: any) {
        super(TOKENIZATION, payload)
    }
}

export class ClearTokenizationSubmit extends StateUtils.LoaderResetAction {
  override readonly type = CLEAR_TOKENIZATION_SUBMIT;
    constructor() {
        super(TOKENIZATION);
    }
}

export type TokenizationSumitAction = TokenizationSubmit | TokenizationSubmitFail | TokenizationSubmitSuccess
    | ClearTokenizationSubmit;
