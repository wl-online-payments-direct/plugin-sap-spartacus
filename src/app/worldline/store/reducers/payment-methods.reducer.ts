import { PaymentProduct } from "../../model/payment.model";
import { WorldlineActions } from "../actions";

export const initialState: PaymentProduct[] = [];

export function reducer(
    state = initialState,
    action: WorldlineActions.PaymentMethodsAction
): PaymentProduct[] {
    switch (action.type) {
        case WorldlineActions.LOAD_PAYMENT_METHODS_SUCCESS: {
            return action.payload ? action.payload : initialState;
        }

        case WorldlineActions.LOAD_PAYMENT_METHODS_FAIL: {
            return initialState;
        }

        case WorldlineActions.LOAD_PAYMENT_METHODS_RESET: {
            return initialState;
        }
    }
    return state;
}
