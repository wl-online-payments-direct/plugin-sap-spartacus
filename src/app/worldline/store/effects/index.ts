import { CheckoutEffects } from './checkout.effect';
import { PaymentMethodsEffects } from './payment-methods.effect';
import { TokenizationEffect } from './tokenization.effect';
import {GetHostedCheckoutEffect} from "./get-hosted-checkout.effect";
import {PlaceHostedCheckoutResponseEffect} from "./place-hosted-checkout-response.effect";
import {PlaceHostedTokenizationResponseEffect} from "./place-hosted-tokenization-response.effect";
import {GetGooglePayEffect} from "./get-google-pay.effects";

export const effects: any[] = [ PaymentMethodsEffects,
                                CheckoutEffects,
                                TokenizationEffect,
                                GetHostedCheckoutEffect,
                                PlaceHostedCheckoutResponseEffect,
                                PlaceHostedTokenizationResponseEffect,
                                GetGooglePayEffect];
