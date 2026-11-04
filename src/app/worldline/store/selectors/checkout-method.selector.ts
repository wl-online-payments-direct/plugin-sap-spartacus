import { createSelector, MemoizedSelector } from "@ngrx/store";
import { StateUtils } from "@spartacus/core";
import { LoaderState } from "@spartacus/core/src/state/utils/loader";
import { CheckoutMethod } from "../../model/payment.model";
import { WorldlineState, StateWithWorldline } from "../worldline-state";
import { getWorldlineState } from "./genertic";

export const getCheckoutMethodState: MemoizedSelector<
    StateWithWorldline,
    LoaderState<CheckoutMethod>
> = createSelector(getWorldlineState, (state: WorldlineState) => {
return state.checkoutMethod;
}
);

export const getCheckoutMethod: MemoizedSelector<
    StateWithWorldline,
    CheckoutMethod
> = createSelector(
    getCheckoutMethodState,
    (state: LoaderState<CheckoutMethod>) => {
      return StateUtils.loaderValueSelector(state);
    }
);

export const getCheckoutMethodStateLoading: MemoizedSelector<
    StateWithWorldline,
    boolean
> = createSelector(
    getCheckoutMethodState,
    (state: LoaderState<CheckoutMethod>) => StateUtils.loaderLoadingSelector(state)
);

export const getCheckoutMethodStateSuccess: MemoizedSelector<
    StateWithWorldline,
    boolean
> = createSelector(
    getCheckoutMethodState,
    (state: LoaderState<CheckoutMethod>) => StateUtils.loaderLoadingSelector(state)
);

export const getCheckoutMethodStateFail: MemoizedSelector<
    StateWithWorldline,
    boolean
> = createSelector(
    getCheckoutMethodState,
    (state: LoaderState<CheckoutMethod>) => StateUtils.loaderLoadingSelector(state)
);
