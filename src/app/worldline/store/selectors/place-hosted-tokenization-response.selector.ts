import {createSelector, MemoizedSelector} from "@ngrx/store";
import {StateUtils} from "@spartacus/core";
import { ReplenishmentOrder } from '@spartacus/order/root/model'
import {LoaderState} from "@spartacus/core/src/state/utils/loader";
import {WorldlineState, StateWithWorldline} from "../worldline-state";
import {getWorldlineState} from "./genertic";
import {loaderCancelSelector} from "../../utils/loader";
import {Order} from "../../model/cart.model";

export const placeHostedTokenizationResponseState: MemoizedSelector<StateWithWorldline,
  LoaderState<Order | ReplenishmentOrder>> = createSelector(getWorldlineState, (state: WorldlineState) => state.placeHostedTokenizationResponse);

export const placeHostedTokenizationResponseResult: MemoizedSelector<StateWithWorldline,
  Order | ReplenishmentOrder> = createSelector(
  placeHostedTokenizationResponseState,
  (state: LoaderState<Order | ReplenishmentOrder>) => StateUtils.loaderValueSelector(state)
);

export const placeHostedTokenizationResponseLoading: MemoizedSelector<StateWithWorldline,
  boolean> = createSelector(
  placeHostedTokenizationResponseState,
  (state: LoaderState<Order | ReplenishmentOrder>) => StateUtils.loaderLoadingSelector(state)
);

export const placeHostedTokenizationResponseSuccess: MemoizedSelector<StateWithWorldline,
  boolean> = createSelector(
  placeHostedTokenizationResponseState,
  (state: LoaderState<Order | ReplenishmentOrder>) => StateUtils.loaderSuccessSelector(state)
);

export const placeHostedTokenizationResponseFail: MemoizedSelector<StateWithWorldline,
  boolean> = createSelector(
  placeHostedTokenizationResponseState,
  (state: LoaderState<Order | ReplenishmentOrder>) => StateUtils.loaderErrorSelector(state)
);

export const placeHostedTokenizationResponseCancel: MemoizedSelector<StateWithWorldline,
  boolean> = createSelector(
  placeHostedTokenizationResponseState,
  (state: LoaderState<Order | ReplenishmentOrder>) => loaderCancelSelector(state)
);
