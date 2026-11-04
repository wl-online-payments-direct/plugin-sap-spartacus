import { CxEvent } from '@spartacus/core';
import { TokenizationResult } from '../model/tokenization.model';
import { HostedCheckout } from '../model/payment.model';

export class WorldlineRedirectTokenizationEvent extends CxEvent {
    /**
     * Event's type
     */
    static override readonly type = "WorldlineRedirectTokenizationEvent";
    /**
     * Tokenization Response
     */
    tokenizationResponse: TokenizationResult;
}

export class WorldlineRedirectHOPEvent extends CxEvent {
    /**
     * Event's type
     */
    static override readonly type = "WorldlineRedirectHOPEvent";
    /**
     * HOP Response
     */
    hopResponse: HostedCheckout;
}
