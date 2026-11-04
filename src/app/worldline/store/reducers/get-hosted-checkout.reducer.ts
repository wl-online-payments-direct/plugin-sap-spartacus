import {WorldlineActions} from "../actions";
import {HostedCheckout} from "../../model/payment.model";

export const initialState: HostedCheckout = {};

export function reducer(
  state = initialState,
  action: WorldlineActions.GetHostedCheckoutSubmitAction
): HostedCheckout {
  switch (action.type) {
    case WorldlineActions.GET_HOSTED_CHECKOUT_SUCCESS: {
      return action.payload ? action.payload : initialState;
    }
    case WorldlineActions.GET_HOSTED_CHECKOUT_FAIL: {
      return initialState;
    }
    case WorldlineActions.CLEAR_GET_HOSTED_CHECKOUT_SUBMIT: {
      return initialState;
    }
  }
  return state;
}
