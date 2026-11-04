
import { WorldlinePaymentInfo } from "../../model/cart.model";
import { WorldlineActions } from "../actions";

export const initialState: WorldlinePaymentInfo = {};

export function reducer(
    state = initialState,
    action: WorldlineActions.PaymentInfoAction
): WorldlinePaymentInfo {
    switch (action.type) {
        case WorldlineActions.LOAD_PAYMENT_INFO_SUCCESS: {
            return action.payload ? action.payload : initialState;
        }
        case WorldlineActions.LOAD_PAYMENT_METHODS_FAIL: {
            return initialState;
        }
    }
    return state;
}
