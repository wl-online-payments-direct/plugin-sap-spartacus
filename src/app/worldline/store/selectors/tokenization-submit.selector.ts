import { createSelector, MemoizedSelector } from "@ngrx/store";
import { StateUtils } from "@spartacus/core";
import { LoaderState } from "@spartacus/core/src/state/utils/loader";
import { TokenizationResult } from "../../model/tokenization.model";
import { WorldlineState, StateWithWorldline } from "../worldline-state";
import { getWorldlineState } from "./genertic";

export const getTokenizationState: MemoizedSelector<
    StateWithWorldline,
    LoaderState<TokenizationResult>
> = createSelector(getWorldlineState, (state: WorldlineState) => state.tokenizationResult);

export const getTokenizationResult: MemoizedSelector<
    StateWithWorldline,
    TokenizationResult
> = createSelector(
    getTokenizationState,
    (state: LoaderState<TokenizationResult>) => StateUtils.loaderValueSelector(state)
);

export const getTokenizationLoading: MemoizedSelector<
    StateWithWorldline,
    boolean
> = createSelector(
    getTokenizationState,
    (state: LoaderState<TokenizationResult>) => StateUtils.loaderLoadingSelector(state)
);

export const getTokenizationSuccess: MemoizedSelector<
    StateWithWorldline,
    boolean
> = createSelector(
    getTokenizationState,
    (state: LoaderState<TokenizationResult>) => StateUtils.loaderSuccessSelector(state)
);

export const getTokenizationFail: MemoizedSelector<
    StateWithWorldline,
    boolean
> = createSelector(
    getTokenizationState,
    (state: LoaderState<TokenizationResult>) => StateUtils.loaderErrorSelector(state)
);
