import { createSelector, MemoizedSelector } from "@ngrx/store";
import { StateUtils } from "@spartacus/core";
import { LoaderState } from "@spartacus/core/src/state/utils/loader";
import { WorldlinePaymentInfo } from "../../model/cart.model";
import { WorldlineState, StateWithWorldline } from "../worldline-state";
import { getWorldlineState } from "./genertic";

export const getPaymentInfoState: MemoizedSelector<
    StateWithWorldline,
    LoaderState<WorldlinePaymentInfo>
> = createSelector(getWorldlineState, (state: WorldlineState) => state.paymentInfo);

export const getPaymentInfo: MemoizedSelector<
    StateWithWorldline,
    WorldlinePaymentInfo
> = createSelector(
    getPaymentInfoState,
    (state: LoaderState<WorldlinePaymentInfo>) => StateUtils.loaderValueSelector(state)
);

export const getPaymentInfoLoading: MemoizedSelector<
    StateWithWorldline,
    boolean
> = createSelector(
    getPaymentInfoState,
    (state: LoaderState<WorldlinePaymentInfo>) => StateUtils.loaderLoadingSelector(state)
);

export const getPaymentInfoSuccess: MemoizedSelector<
    StateWithWorldline,
    boolean
> = createSelector(
    getPaymentInfoState,
    (state: LoaderState<WorldlinePaymentInfo>) => StateUtils.loaderSuccessSelector(state)
);

export const getPaymentInfoFail: MemoizedSelector<
    StateWithWorldline,
    boolean
> = createSelector(
    getPaymentInfoState,
    (state: LoaderState<WorldlinePaymentInfo>) => StateUtils.loaderErrorSelector(state)
);
