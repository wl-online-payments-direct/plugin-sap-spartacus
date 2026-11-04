import {
  CheckoutConfig,
  CheckoutStepType,
  DeliveryModePreferences,
} from '@spartacus/checkout/base/root';
import {worldlineConstants} from "../../constants/worldlineConstants";

export const defaultB2cCheckoutConfig: CheckoutConfig = {
  checkout: {
    steps: [
      {
        id: 'deliveryAddress',
        name: 'checkoutProgress.deliveryAddress',
        routeName: 'checkoutDeliveryAddress',
        type: [CheckoutStepType.DELIVERY_ADDRESS],
      },
      {
        id: 'deliveryMode',
        name: 'checkoutProgress.deliveryMode',
        routeName: 'checkoutDeliveryMode',
        type: [CheckoutStepType.DELIVERY_MODE],
      },
      {
        id: 'worldlinePaymentDetails',
        name: 'checkoutProgress.paymentDetails',
        routeName: worldlineConstants.cms.contentPages.worldlinePaymentMethod.id,
        type:[CheckoutStepType.PAYMENT_DETAILS],
      },
      {
        id: 'reviewOrder',
        name: 'checkoutProgress.reviewOrder',
        routeName: 'worldlineOrderReview',
        type: [CheckoutStepType.REVIEW_ORDER],
      }
    ],
    express: false,
    defaultDeliveryMode: [DeliveryModePreferences.FREE],
    guest: true,
  },
};
