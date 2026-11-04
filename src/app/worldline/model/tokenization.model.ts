import { Order } from '@spartacus/order/root/model';

export interface TokenizationResult {
    status: string;
    redirectTo?: string;
    reason?: string;
    order?: Order
}
