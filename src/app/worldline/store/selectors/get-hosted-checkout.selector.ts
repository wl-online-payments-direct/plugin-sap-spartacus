import {createSelector, MemoizedSelector} from "@ngrx/store";
import {StateUtils} from "@spartacus/core";
import {LoaderState} from "@spartacus/core/src/state/utils/loader";
import {WorldlineState, StateWithWorldline} from "../worldline-state";
import {getWorldlineState} from "./genertic";
import {HostedCheckout} from "../../model/payment.model";

export const getHostedCheckoutState: MemoizedSelector<StateWithWorldline,
  LoaderState<HostedCheckout>> = createSelector(getWorldlineState, (state: WorldlineState) => state.getHostedCheckout);

export const getHostedCheckoutResult: MemoizedSelector<StateWithWorldline,
  HostedCheckout> = createSelector(
  getHostedCheckoutState,
  (state: LoaderState<HostedCheckout>) => StateUtils.loaderValueSelector(state)
);

export const getHostedCheckoutLoading: MemoizedSelector<StateWithWorldline,
  boolean> = createSelector(
  getHostedCheckoutState,
  (state: LoaderState<HostedCheckout>) => StateUtils.loaderLoadingSelector(state)
);

export const getHostedCheckoutSuccess: MemoizedSelector<StateWithWorldline,
  boolean> = createSelector(
  getHostedCheckoutState,
  (state: LoaderState<HostedCheckout>) => StateUtils.loaderSuccessSelector(state)
);

export const getHostedCheckoutFail: MemoizedSelector<StateWithWorldline,
  boolean> = createSelector(
  getHostedCheckoutState,
  (state: LoaderState<HostedCheckout>) => StateUtils.loaderErrorSelector(state)
);
