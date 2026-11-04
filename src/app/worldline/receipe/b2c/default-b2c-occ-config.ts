// We need this import for augmentation of OccEndpoints to pick up
import {CheckoutOccEndpoints} from '@spartacus/checkout/base/occ';
import {OccConfig, OccEndpoint} from '@spartacus/core';
import {OrderOccEndpoints} from '@spartacus/order/occ';

// While it is not strictly required to define checkout endpoints in a separate `CheckoutOccEndpoints`
// variable, type augmentation does require that this file imports `CheckoutOccEndpoints`.
// A good way to make sure the `CheckoutOccEndpoints` import is not removed by mistake is to use
// `CheckoutOccEndpoints` in the code.
export interface WorldlineCheckoutOccEndPoints {
  getHostedCheckout?: string | OccEndpoint;
  getRecurringHostedCheckout?: string | OccEndpoint;
  submitHostedCheckout?: string | OccEndpoint;
  submitTokenizationCheckout?: string | OccEndpoint;
  googlePay?: string | OccEndpoint;
  payByLink?: string | OccEndpoint;
  submitRecurringGooglePay?: string | OccEndpoint;
  getTokenizationCheckout?: string | OccEndpoint;
  getTokenizationRecurringCheckout?: string | OccEndpoint;
  isRecurringPossible?: string | OccEndpoint;
  displaySurcharge?: string | OccEndpoint;
  saveReplenishmentData?: string | OccEndpoint;
  getReplenishmentData?: string | OccEndpoint;
  isTokenTemporary?: string | OccEndpoint;
}

const defaultB2cCheckoutOccEndpoints: CheckoutOccEndpoints = {
  setDeliveryAddress: 'users/${userId}/carts/${cartId}/addresses/delivery',
};

const defaultB2cOrderOccEndpoints: OrderOccEndpoints = {
  placeOrder: '${userId}/orders?fields=FULL',
};

const  defaultWorldlineB2cCheckoutOccEndPoints: WorldlineCheckoutOccEndPoints =
{
  getHostedCheckout: 'users/${userId}/orders/hostedCheckout',
  getRecurringHostedCheckout:'users/${userId}/orders/recurringHostedCheckout',
  submitHostedCheckout:'worldline/${userId}/hosted/${orderOrReplenishmentCode}/hostedCheckout/return?fields=FULL',
  submitTokenizationCheckout:'worldline/${userId}/hosted/${orderOrReplenishmentCode}/hostedTokenization/return?fields=FULL',
  getTokenizationCheckout:'users/${userId}/orders/hostedTokenization?fields=FULL',
  getTokenizationRecurringCheckout:'users/${userId}/orders/recurringHostedTokenizationCheckout?fields=FULL',
  googlePay:'users/${userId}/orders/googlePay?fields=FULL',
  payByLink:'users/${userId}/orders/payByLink?fields=FULL',
  submitRecurringGooglePay:'users/${userId}/orders/recurringGooglePay?fields=FULL',
  isRecurringPossible:'users/${userId}/carts/${cartId}/supportRecurring',
  displaySurcharge:'users/${userId}/carts/${cartId}/displaySurcharge',
  saveReplenishmentData:'users/${userId}/carts/${cartId}/saveReplenishmentOrderData',
  getReplenishmentData:'users/${userId}/carts/${cartId}/getReplenishmentOrderData',
  isTokenTemporary: 'users/${userId}/carts/${cartId}/isTokenTemporary'
}

export const defaultB2cOccConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        ...defaultWorldlineB2cCheckoutOccEndPoints,
        ...defaultB2cCheckoutOccEndpoints,
        ...defaultB2cOrderOccEndpoints,
        scheduleReplenishmentOrder:
          'orgUsers/${userId}/replenishmentOrders?fields=FULL,costCenter(FULL),purchaseOrderNumber,paymentType',
        replenishmentOrderDetails:
          'users/${userId}/replenishmentOrders/${replenishmentOrderCode}?fields=FULL,costCenter(FULL),purchaseOrderNumber,paymentType,user',
        replenishmentOrderDetailsHistory:
          'users/${userId}/replenishmentOrders/${replenishmentOrderCode}/orders',
        cancelReplenishmentOrder:
          'users/${userId}/replenishmentOrders/${replenishmentOrderCode}?fields=FULL,costCenter(FULL),purchaseOrderNumber,paymentType,user',
        replenishmentOrderHistory:
          'users/${userId}/replenishmentOrders?fields=FULL,replenishmentOrders(FULL, purchaseOrderNumber)'
      },
    },
  },
};
