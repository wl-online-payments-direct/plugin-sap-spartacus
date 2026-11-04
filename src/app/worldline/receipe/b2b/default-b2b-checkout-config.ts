import {worldlineConstants} from "../../constants/worldlineConstants";
import { DeliveryModePreferences, CheckoutConfig, CheckoutStepType } from '@spartacus/checkout/base/root';
export const defaultB2BCheckoutConfig: CheckoutConfig = {
    checkout: {
        steps: [
            {
                id: 'paymentType',
                name: 'checkoutB2B.progress.methodOfPayment',
                routeName: 'checkoutPaymentType',
                type: [ CheckoutStepType.PAYMENT_TYPE ],
            },
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
                type: [CheckoutStepType.PAYMENT_DETAILS],
            },
            {
                id: 'reviewOrder',
                name: 'checkoutProgress.reviewOrder',
                routeName: 'worldlineOrderReview',
                type: [CheckoutStepType.REVIEW_ORDER],
            },
        ],
        express: false,
        defaultDeliveryMode: [DeliveryModePreferences.FREE],
        guest: false,
    },
};





