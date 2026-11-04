import { CheckoutMethod } from "../../model/payment.model";
import { WorldlineActions } from "../actions";

export const initialState: CheckoutMethod = {};

export function reducer(
    state = initialState,
    action: WorldlineActions.CheckoutAction
): CheckoutMethod {
    switch (action.type) {
        case WorldlineActions.PLACE_ORDER_SUCCESS: {
            return action.payload ? action.payload : initialState;
        }
    }
    return state;
}
