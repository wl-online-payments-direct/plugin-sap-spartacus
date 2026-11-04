

export interface Hints {
    displayOrder?: string;
    label?: string;
    logo?: string;
}

export interface PaymentProduct {
    id?: string;
    paymentMethod?: string;
    displayHints?: Hints;
}

export interface PaymentProductList {
    paymentProducts?: PaymentProduct[]
}

export interface CheckoutMethod {
    worldlineCheckoutType?: string
}

export interface HostedCheckout {
    hostedCheckoutId?: string,
    redirectURL?: string
}

export interface GooglePay {
    environment?: string,
    merchantId?: string,
    merchantName?: string,
    gateway?: string,
    gatewayMerchantId?: string,
    networks?: string,
    countryCode?: string,
    currencyCode?: string,
    totalPrice?: string

}

