import { InjectionToken } from "@angular/core";
import { Converter } from "@spartacus/core";
import { TokenizationResult } from "../model/tokenization.model";
import {WorldlineScheduleReplenishmentForm} from "../model/cart.model";

export const TOKEN_RESULT_NORMALIZER = new InjectionToken<Converter<any, TokenizationResult>>(
    'TokenResultNormalizer'
);
export const WORLDLINE_REPLENISHMENT_ORDER_FORM_SERIALIZER = new InjectionToken<
  Converter<WorldlineScheduleReplenishmentForm, any>
  >('worldlineReplenishmentOrderFormSerializer');
