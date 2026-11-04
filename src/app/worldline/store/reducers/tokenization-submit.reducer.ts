import { TokenizationResult } from "../../model/tokenization.model";
import { WorldlineActions } from "../actions";

export const initialState: TokenizationResult = { status: "" };

export function reducer(
    state = initialState,
    action: WorldlineActions.TokenizationSumitAction
): TokenizationResult {
    switch (action.type) {
        case WorldlineActions.TOKENIZATION_SUBMIT_SUCCESS: {
            return action.payload ? action.payload : initialState;
        }

        case WorldlineActions.TOKENIZATION_SUBMIT_FAIL: {
            return initialState;
        }

        case WorldlineActions.CLEAR_TOKENIZATION_SUBMIT: {
            return initialState;
        }

    }
    return state;
}
