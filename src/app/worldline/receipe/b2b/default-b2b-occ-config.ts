// We need this import for augmentation of OccEndpoints to pick up
import { UserAccountOccEndpoints } from '@spartacus/user/account/occ';
import { UserProfileOccEndpoints } from '@spartacus/user/profile/occ';
import {OccConfig} from '@spartacus/core';
import {OrderOccEndpoints} from '@spartacus/order/occ';
import {CheckoutOccEndpoints} from "@spartacus/checkout/base/occ";
import {WorldlineCheckoutOccEndPoints} from "../b2c/default-b2c-occ-config";

// While it is not strictly required to define checkout endpoints in a separate `CheckoutOccEndpoints`
// variable, type augmentation does require that this file imports `CheckoutOccEndpoints`.
// A good way to make sure the `CheckoutOccEndpoints` import is not removed by mistake is to use
// `CheckoutOccEndpoints` in the code.

const defaultB2bCheckoutOccEndpoints: CheckoutOccEndpoints = {
  setDeliveryAddress: 'orgUsers/${userId}/carts/${cartId}/addresses/delivery'
};

const defaultB2BOrderOccEndpoints: OrderOccEndpoints = {
  placeOrder: 'orgUsers/${userId}/orders?fields=FULL',
  reorder: 'orgUsers/${userId}/cartFromOrder?orderCode=${orderCode}'
}

const  defaultWorldlineB2bCheckoutOccEndPoints: WorldlineCheckoutOccEndPoints =
  {
    getHostedCheckout: 'orgUsers/${userId}/orders/hostedCheckout',
    getRecurringHostedCheckout:'orgUsers/${userId}/orders/recurringHostedCheckout',
    submitHostedCheckout:'worldline/${userId}/hosted/${orderOrReplenishmentCode}/hostedCheckout/return?fields=FULL',
    submitTokenizationCheckout:'worldline/${userId}/hosted/${orderOrReplenishmentCode}/hostedTokenization/return?fields=FULL',
    getTokenizationCheckout:'orgUsers/${userId}/orders/hostedTokenization?fields=FULL',
    getTokenizationRecurringCheckout:'orgUsers/${userId}/orders/recurringHostedTokenizationCheckout?fields=FULL',
    googlePay:'orgUsers/${userId}/orders/googlePay?fields=FULL',
    payByLink:'orgUsers/${userId}/orders/payByLink?fields=FULL',
    submitRecurringGooglePay:'orgUsers/${userId}/orders/recurringGooglePay?fields=FULL',
    isRecurringPossible:'users/${userId}/carts/${cartId}/supportRecurring',
    displaySurcharge:'users/${userId}/carts/${cartId}/displaySurcharge',
    saveReplenishmentData:'users/${userId}/carts/${cartId}/saveReplenishmentOrderData',
    getReplenishmentData:'users/${userId}/carts/${cartId}/getReplenishmentOrderData',
    isTokenTemporary: 'users/${userId}/carts/${cartId}/isTokenTemporary'
  }


const defaultB2bUserAccountOccEndpoints: UserAccountOccEndpoints = {
  user: 'orgUsers/${userId}',
};

const defaultB2bUserProfileOccEndpoints: UserProfileOccEndpoints = {
  userUpdateProfile: 'users/${userId}',
  userCloseAccount: 'users/${userId}',
};

export const defaultB2bOccConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        ...defaultWorldlineB2bCheckoutOccEndPoints,
        ...defaultB2bCheckoutOccEndpoints,
        ...defaultB2bUserAccountOccEndpoints,
        ...defaultB2bUserProfileOccEndpoints,
        ...defaultB2BOrderOccEndpoints,
        user: 'orgUsers/${userId}',
        userUpdateProfile: 'users/${userId}',
        userCloseAccount: 'users/${userId}',
        addEntries:
          'orgUsers/${userId}/carts/${cartId}/entries?quantity=${quantity}',
        scheduleReplenishmentOrder:
          'orgUsers/${userId}/replenishmentOrders?fields=FULL,costCenter(FULL),purchaseOrderNumber,paymentType',
        replenishmentOrderDetails:
          'users/${userId}/replenishmentOrders/${replenishmentOrderCode}?fields=FULL,costCenter(FULL),purchaseOrderNumber,paymentType,user',
        replenishmentOrderDetailsHistory:
          'users/${userId}/replenishmentOrders/${replenishmentOrderCode}/orders',
        cancelReplenishmentOrder:
          'users/${userId}/replenishmentOrders/${replenishmentOrderCode}?fields=FULL,costCenter(FULL),purchaseOrderNumber,paymentType,user',
        replenishmentOrderHistory:
          'users/${userId}/replenishmentOrders?fields=FULL,replenishmentOrders(FULL, purchaseOrderNumber)',
      },
    },
  },
};
