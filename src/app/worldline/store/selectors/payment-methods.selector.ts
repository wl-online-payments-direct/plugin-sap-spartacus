import { createSelector, MemoizedSelector } from "@ngrx/store";
import { StateUtils } from "@spartacus/core";
import { LoaderState } from "@spartacus/core/src/state/utils/loader";
import { PaymentProduct } from "../../model/payment.model";
import { WorldlineState, StateWithWorldline } from "../worldline-state";
import { getWorldlineState } from "./genertic";

export const getPaymentMethodsState: MemoizedSelector<
    StateWithWorldline,
    LoaderState<PaymentProduct[]>
> = createSelector(getWorldlineState, (state: WorldlineState) => state.paymentMethods);

export const getPaymentMethods: MemoizedSelector<
    StateWithWorldline,
    PaymentProduct[]
> = createSelector(
    getPaymentMethodsState,
    (state: LoaderState<PaymentProduct[]>) => StateUtils.loaderValueSelector(state)
);

export const getPaymentMethodsLoading: MemoizedSelector<
    StateWithWorldline,
    boolean
> = createSelector(
    getPaymentMethodsState,
    (state: LoaderState<PaymentProduct[]>) => StateUtils.loaderLoadingSelector(state)
);
