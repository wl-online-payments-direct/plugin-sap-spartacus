import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  I18nextTranslationService,
  I18nModule,
  POINT_OF_SERVICE_NORMALIZER, // Not present in REPO code
  provideConfig,
  TranslationChunkService,
  UrlModule,
  UserPaymentAdapter
} from '@spartacus/core';
import { OccOrderNormalizer } from '@spartacus/order/occ'
import { ORDER_NORMALIZER } from '@spartacus/order/root';
import { AsmConfig } from '@spartacus/asm/root';
import {
  provideOutlet, CardModule,
  DIALOG_TYPE,
  IconModule,
  LayoutConfig,
  PromotionsModule,
  SpinnerComponent,
  SpinnerModule,
  FormErrorsModule
} from '@spartacus/storefront';
import { ReactiveFormsModule } from '@angular/forms';
import { WorldlineStoreModule } from './store/worldline-store.module';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TOKEN_RESULT_NORMALIZER, WORLDLINE_REPLENISHMENT_ORDER_FORM_SERIALIZER } from './converter/converters';
import { TokenizationResultNormalizer } from './converter/tokenization-result-normalizer';
import { WorldlineUserPaymentAdapter } from './connector/payment-details.connector';
import { WorldlineOrderConfirmationGuard } from './guard/worldline-order-confirmation.guard';
import {
  CheckoutPaymentFormModule
} from "@spartacus/checkout/base/components";
import {
  WorldlineScheduleReplenishmentOrderModule
} from "./components/worldline-schedule-replenishment-order/worldline-schedule-replenishment-order.module";
import {
  WorldlineOrderConfirmaionOverviewModule
} from "./components/worldline-order-confirmation-overview/worldline-order-confirmaion-overview.module";
import {
  AccountReviewSubmitModule
} from "./shared/component/review-submit/account-review-submit/account-review-submit.module";
import { WorldlineOrderOverviewModule } from "./shared/component/worldline-order-overview";
import {
  WorldlineReviewSubmitModule
} from "./shared/component/review-submit/cart-review-submit/worldline-review-submit.module";
import {
  WorldlineTokenizationThreedsModule
} from "./components/worldline-tokenization-threeds/worldline-tokenization-threeds.module";
import {
  WorldlineHostedCheckoutResponseModule
} from "./components/worldline-hosted-checkout-response/worldline-hosted-checkout-response.module";
import { WorldlinePaymentMethodModule } from "./components/worldline-payment-method/worldline-payment-method.module";
import { WorldlinePaymentMethodsModule } from "./components/worldline-payment-methods/worldline-payment-methods.module";
import { WorldlinePlaceOrderModule } from "./components/worldline-place-order/worldline-place-order.module";
import { WorldlineReviewOrderModule } from "./components/worldline-review-order/worldline-review-order.module";
import {
  WorldlineCheckoutProgressMobileBottomModule
} from "./components/worldline-checkout-progress/worldline-checkout-progress-mobile-bottom/worldline-checkout-progress-mobile-bottom.module";
import {
  WorldlineCheckoutProgressMobileTopModule
} from "./components/worldline-checkout-progress/worldline-checkout-progress-mobile-top/worldline-checkout-progress-mobile-top.module";
import {
  WorldlineCheckoutProgressModule
} from "./components/worldline-checkout-progress/worldline-checkout-progress/worldline-checkout-progress.module";
import {
  WorldlineOrderDetailShippingModule
} from "./components/order-details/worldline-order-detail-shipping/worldline-order-detail-shipping.module";
import { worldlineConstants } from "./constants/worldlineConstants";
import { environment } from "../../environments/environment";
import { defaultB2bOccConfig } from "./receipe/b2b/default-b2b-occ-config";
import { defaultB2cOccConfig } from "./receipe/b2c/default-b2c-occ-config";
import { defaultB2BCheckoutConfig } from "./receipe/b2b/default-b2b-checkout-config";
import { defaultB2cCheckoutConfig } from "./receipe/b2c/default-b2c-checkout-config";
import {
  WorldlineOrderConfirmationMandateDetailModule
} from "./components/worldline-mandate-details/worldline-order-confirmation-mandate-detail/worldline-order-confirmation-mandate-detail.module";
import { WorldlineAccountMandateDetailModule } from './components/worldline-mandate-details/worldline-replenishment-detail-mandate-detail/worldline-account-mandate-detail.module';
import {
  WorldlineOccReplenishmentOrderFormSerializer
} from "./converter/worldline-occ-replenishment-order-form-serializer";
import { WorldlineOrderConfirmationTotalsModule } from './components/worldline-order-confirmation-totals/worldline-order-confirmation-totals.module';
import { WorldlineCheckoutOrderSummaryModule } from './components/worldline-checkout-order-summary/worldline-checkout-order-summary.module';
import { WorldlineOrderDetailTotalsModule } from './components/worldline-order-detail-totals/worldline-order-detail-totals.module';
import { WorldlineCartTotalsModule } from './shared/component/worldline-cart-totals/worldline-cart-totals.module';
import { WorldlineCartProceedToCheckoutModule } from './shared/component/worldline-cart-proceed-to-checkout/worldline-cart-proceed-to-checkout.module';
import { OrderDetailBillingComponent, OrderConfirmationThankYouMessageComponent, OrderConfirmationShippingComponent } from '@spartacus/order/components';
import { OrderDetailsService } from "@spartacus/order/components";
import { OrderFacade } from '@spartacus/order/root';
import { PlaceOrderService } from './facade/place-order.service';
import { CartBaseModule } from '@spartacus/cart/base';
import { WorldlineCheckoutOrchestratorGuard } from './guard/worldline-checkout-orchestrator.guard';
import { WorldlineCheckoutFallbackComponent } from './components/worldline-checkout-fallback.component';

export const defaultPlaceOrderSpinnerLayoutConfig: LayoutConfig = {
  launch: {
    PLACE_ORDER_SPINNER: {
      inline: true,
      component: SpinnerComponent,
      dialogType: DIALOG_TYPE.POPOVER_CENTER_BACKDROP,
    },
  },
};

@NgModule({
  declarations: [WorldlineCheckoutFallbackComponent],
  providers: [
    //{ provide: OrderFacade, useExisting: PlaceOrderService }, //TODO: NOT PRESENT IN REPO CODE - It seems in one place the Facade was used here but in the repo the Service is used directly.
    provideConfig({
      routing: {
        routes: {
          worldlineCheckoutPaymentMethodsPage: {
            paths: [worldlineConstants.cms.contentPages.worldlinePaymentMethod.label]
          },
          worldlineOrderReview: {
            paths: [worldlineConstants.cms.contentPages.worldlineOrderReview.label]
          }
        },
      }
    }),
    provideConfig({
      cmsComponents: {
        OrderConfirmationThankMessageComponent: {
          component: OrderConfirmationThankYouMessageComponent,
          providers: [
            {
              provide: OrderFacade,
              useExisting: PlaceOrderService,
            },
          ],
          guards: [WorldlineOrderConfirmationGuard],
        },
        ReplenishmentConfirmationMessageComponent: {
          providers: [
            {
              provide: OrderFacade,
              useExisting: PlaceOrderService,
            },
          ],
          guards: [WorldlineOrderConfirmationGuard],
        },
        OrderConfirmationItemsComponent: {
          providers: [
            {
              provide: OrderFacade,
              useExisting: PlaceOrderService,
            },
          ],
          guards: [WorldlineOrderConfirmationGuard],
        },
        ReplenishmentConfirmationItemsComponent: {
          providers: [
            {
              provide: OrderFacade,
              useExisting: PlaceOrderService,
            },
          ],
          guards: [WorldlineOrderConfirmationGuard],
        },
        OrderConfirmationTotalsComponent: {
          providers: [
            {
              provide: OrderFacade,
              useExisting: PlaceOrderService,
            },
          ],
          guards: [WorldlineOrderConfirmationGuard],
        },
        ReplenishmentConfirmationTotalsComponent: {
          providers: [
            {
              provide: OrderFacade,
              useExisting: PlaceOrderService,
            },
          ],
          guards: [WorldlineOrderConfirmationGuard],
        },
        OrderConfirmationShippingComponent: {
          providers: [
            {
              provide: OrderFacade,
              useExisting: PlaceOrderService,
            },
          ],
          guards: [WorldlineOrderConfirmationGuard],
        },
        OrderConfirmationBillingComponent: {
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: PlaceOrderService,
            },
          ],
          guards: [WorldlineOrderConfirmationGuard],
        },
        //TODO: This is not present in the repo code
        CustomOrderConfirmationItemsComponent: {
          guards: [WorldlineOrderConfirmationGuard]
        }
      }
    }),
    provideConfig(environment.b2b ? defaultB2bOccConfig : defaultB2cOccConfig),
    provideConfig(environment.b2b ? defaultB2BCheckoutConfig : defaultB2cCheckoutConfig),
    provideConfig({
      cmsComponents: !environment.b2b
        ? {
            CheckoutOrchestrator: {
              component: WorldlineCheckoutFallbackComponent,
              guards: [WorldlineCheckoutOrchestratorGuard],
            },
          }
        : {},
    }),
    provideConfig(defaultPlaceOrderSpinnerLayoutConfig),
    { provide: ORDER_NORMALIZER, useExisting: OccOrderNormalizer, multi: true },
    { provide: TOKEN_RESULT_NORMALIZER, useExisting: TokenizationResultNormalizer, multi: true },
    { provide: WORLDLINE_REPLENISHMENT_ORDER_FORM_SERIALIZER, useExisting: WorldlineOccReplenishmentOrderFormSerializer, multi: true },
    {
      provide: UserPaymentAdapter,
      useClass: WorldlineUserPaymentAdapter,
    },
    provideConfig(<AsmConfig>{
      asm: {
        userIdHttpHeader: {
          enable: true,
        },
      },
    }),
    // provideConfig({
    //   i18n: {
    //     backend: {
    //       loadPath: 'assets/i18n-assets/{{lng}}/{{ns}}.json'
    //     },
    //     chunks: {
    //       worldline: ['paymentMethod', 'tokenization','mandate','worldlineCheckoutReview','surcharge','replenishmentMessages'],
    //       checkout: ['checkout', 'checkoutReview', 'checkoutProgress'],
    //     }
    //   }
    // }),
  ],
  imports: [
    CommonModule, UrlModule, //CartBaseModule, CartSharedModule,
    I18nModule, SpinnerModule,
    WorldlineStoreModule, ReactiveFormsModule,
    WorldlineCheckoutProgressMobileBottomModule, WorldlineCheckoutProgressMobileTopModule, WorldlineCheckoutProgressModule,
    CheckoutPaymentFormModule, RouterModule, PromotionsModule, CardModule, IconModule, NgSelectModule, FormErrorsModule,
    WorldlineScheduleReplenishmentOrderModule, WorldlinePaymentMethodModule, WorldlinePaymentMethodsModule,
    WorldlineTokenizationThreedsModule, WorldlineHostedCheckoutResponseModule, WorldlinePlaceOrderModule,
    WorldlineOrderDetailShippingModule, WorldlineCartProceedToCheckoutModule, WorldlineOrderOverviewModule, WorldlineOrderConfirmaionOverviewModule,
    WorldlineAccountMandateDetailModule, AccountReviewSubmitModule, WorldlineOrderConfirmationMandateDetailModule,
    WorldlineReviewSubmitModule, WorldlineOrderDetailTotalsModule, WorldlineOrderConfirmationTotalsModule,
    WorldlineReviewOrderModule, WorldlineCheckoutOrderSummaryModule, WorldlineCartTotalsModule
  ],
  exports: []
})
export class WorldlineModule {
}
