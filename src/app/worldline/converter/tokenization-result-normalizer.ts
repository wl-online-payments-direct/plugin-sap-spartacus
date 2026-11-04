import { Injectable } from "@angular/core";
import { Converter, ConverterService } from "@spartacus/core";
import { ORDER_NORMALIZER, REPLENISHMENT_ORDER_NORMALIZER } from '@spartacus/order/root';
import { TokenizationResult } from "../model/tokenization.model";

@Injectable({
    providedIn: 'root',
})
export class TokenizationResultNormalizer
    implements Converter<any, TokenizationResult> {

    constructor(protected converter: ConverterService) { }

    convert(source: any, target?: TokenizationResult): TokenizationResult {
        if (target === undefined) {
            target = { status: "" };
        }
        if (source.type && source.type == "orderWsDTO") {
            target.order = this.converter.convert(source, ORDER_NORMALIZER);
            target.status = "OK";
        } else if (source.type && source.type == "replenishmentOrderWsDTO") {
            target.order = this.converter.convert(source, REPLENISHMENT_ORDER_NORMALIZER);
            target.status = "OK";
       } else if (source.status && source.status == "NEED_3DS") {
            target.status = "NEED_3DS";
            target.redirectTo = source.redirectTo;
        } else {
            target.status = "REJECTED";
        }

        return target;
    }

}
