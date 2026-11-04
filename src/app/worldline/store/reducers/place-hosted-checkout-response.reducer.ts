import {WorldlineActions} from "../actions";
import { ReplenishmentOrder } from '@spartacus/order/root/model';
import {Order} from "../../model/cart.model";

export const initialState: Order | ReplenishmentOrder = {};

export function reducer(
  state = initialState,
  action: WorldlineActions.PlaceHostedCheckoutResponseSubmitAction
): Order | ReplenishmentOrder {
  switch (action.type) {
    case WorldlineActions.PLACE_HOSTED_CHECKOUT_RESPONSE_SUCCESS: {
      return action.payload ? action.payload : initialState;
    }
    case WorldlineActions.PLACE_HOSTED_CHECKOUT_RESPONSE_FAIL: {
      return initialState;
    }
    case WorldlineActions.PLACE_HOSTED_CHECKOUT_RESPONSE_CANCEL: {
      return initialState;
    }
    case WorldlineActions.CLEAR_PLACE_HOSTED_CHECKOUT_RESPONSE_SUBMIT: {
      return initialState;
    }
  }
  return state;
}
