import {createSelector, MemoizedSelector} from "@ngrx/store";
import {StateUtils} from "@spartacus/core";
import { ReplenishmentOrder } from '@spartacus/order/root/model'
import {LoaderState} from "@spartacus/core/src/state/utils/loader";
import {WorldlineState, StateWithWorldline} from "../worldline-state";
import {getWorldlineState} from "./genertic";
import {loaderCancelSelector} from "../../utils/loader";
import {Order} from "../../model/cart.model";

export const placeHostedCheckoutResponseState: MemoizedSelector<StateWithWorldline,
  LoaderState<Order | ReplenishmentOrder>> = createSelector(getWorldlineState, (state: WorldlineState) => state.placeHostedCheckoutResponse);

export const placeHostedCheckoutResponseResult: MemoizedSelector<StateWithWorldline,
  Order | ReplenishmentOrder> = createSelector(
  placeHostedCheckoutResponseState,
  (state: LoaderState<Order | ReplenishmentOrder>) => StateUtils.loaderValueSelector(state)
);

export const placeHostedCheckoutResponseLoading: MemoizedSelector<StateWithWorldline,
  boolean> = createSelector(
  placeHostedCheckoutResponseState,
  (state: LoaderState<Order | ReplenishmentOrder>) => StateUtils.loaderLoadingSelector(state)
);

export const placeHostedCheckoutResponseSuccess: MemoizedSelector<StateWithWorldline,
  boolean> = createSelector(
  placeHostedCheckoutResponseState,
  (state: LoaderState<Order | ReplenishmentOrder>) => StateUtils.loaderSuccessSelector(state)
);

export const placeHostedCheckoutResponseFail: MemoizedSelector<StateWithWorldline,
  boolean> = createSelector(
  placeHostedCheckoutResponseState,
  (state: LoaderState<Order | ReplenishmentOrder>) => StateUtils.loaderErrorSelector(state)
);

export const placeHostedCheckoutResponseCancel: MemoizedSelector<StateWithWorldline,
  boolean> = createSelector(
  placeHostedCheckoutResponseState,
  (state: LoaderState<Order | ReplenishmentOrder>) => loaderCancelSelector(state)
);
