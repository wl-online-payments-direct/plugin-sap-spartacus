import {CheckoutMethod} from "./payment.model";

export interface SavedToken {
    token?: string
    id?: string
    accountHolderName?: string
    expiryDate?: string
    cardBrand?: string
    cardNumber?: string
    expiryMonth?: string
    expiryYear?: string
    paymentMethodImageUrl?: string
    alias?: string
}

export interface SavedPaymentDetails {
    payments: SavedToken[]
}

export interface Token {
    hostedTokenizationId?: string
    redirectURL?: string
    checkoutType?: CheckoutMethod
    savedPaymentDetails?: SavedPaymentDetails
    payments: SavedToken[]

}
