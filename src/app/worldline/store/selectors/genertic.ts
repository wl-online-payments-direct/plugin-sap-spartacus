import { createFeatureSelector, MemoizedSelector } from "@ngrx/store";
import { WorldlineState, WORLDLINE_FEATURE, StateWithWorldline } from "../worldline-state";

export const getWorldlineState: MemoizedSelector<
    StateWithWorldline,
    WorldlineState
> = createFeatureSelector<WorldlineState>(WORLDLINE_FEATURE);
