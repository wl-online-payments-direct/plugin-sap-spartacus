import { StateUtils } from "@spartacus/core";
import {HostedCheckout} from "../../model/payment.model";
import {ORDER_TYPE} from "@spartacus/order/root";

export const GET_HOSTED_CHECKOUT = "[WORLDLINE] get hosted checkout"
export const GET_HOSTED_CHECKOUT_SUBMIT = "[WORLDLINE] get hosted checkout submit";
export const GET_HOSTED_CHECKOUT_SUCCESS = "[WORLDLINE] get hosted checkout submit success";
export const GET_HOSTED_CHECKOUT_FAIL = "[WORLDLINE] get hosted checkout submit fail";
export const CLEAR_GET_HOSTED_CHECKOUT_SUBMIT = "[WORLDLINE] Clear get hosted checkout submit";

export class GetHostedCheckoutSubmit extends StateUtils.LoaderLoadAction {
    override readonly type = GET_HOSTED_CHECKOUT_SUBMIT;

    constructor(public payload: { userId: string, cartId: string,orderType:ORDER_TYPE,body:any }) {
        super(GET_HOSTED_CHECKOUT);
    }

}

export class GetHostedCheckoutSuccess extends StateUtils.LoaderSuccessAction {
    override readonly type = GET_HOSTED_CHECKOUT_SUCCESS;

    constructor(public payload: HostedCheckout) {
        super(GET_HOSTED_CHECKOUT)
    }
}

export class GetHostedCheckoutFail extends StateUtils.LoaderFailAction {
    override readonly type = GET_HOSTED_CHECKOUT_FAIL;

    constructor(public payload: any) {
        super(GET_HOSTED_CHECKOUT, payload)
    }
}

export class ClearGetHostedCheckout extends StateUtils.LoaderResetAction {
    override readonly type = CLEAR_GET_HOSTED_CHECKOUT_SUBMIT;
    constructor() {
        super(GET_HOSTED_CHECKOUT);
    }
}

export type GetHostedCheckoutSubmitAction = GetHostedCheckoutSubmit | GetHostedCheckoutFail | GetHostedCheckoutSuccess
    | ClearGetHostedCheckout;
