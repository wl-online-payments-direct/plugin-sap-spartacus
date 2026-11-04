import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmsConfig, ConfigModule, I18nModule} from "@spartacus/core";
import {IconModule} from "@spartacus/storefront";
import {RouterModule} from "@angular/router";
import {CartNotEmptyGuard, CheckoutAuthGuard} from "@spartacus/checkout/base/components";
import {WorldlineCheckoutStepsSetGuard} from "../../guard/worldline-checkout-steps-set.guard";
import {WorldlineReviewOrderSpaComponent} from "./worldline-review-order.component";
import {
    AccountReviewSubmitModule
} from "../../shared/component/review-submit/account-review-submit/account-review-submit.module";
import {
  WorldlineReviewSubmitModule
} from "../../shared/component/review-submit/cart-review-submit/worldline-review-submit.module";


@NgModule({
  declarations: [WorldlineReviewOrderSpaComponent],
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    RouterModule,
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlineOrderReview: {
          component: WorldlineReviewOrderSpaComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard, WorldlineCheckoutStepsSetGuard],
        }
      }
    } as CmsConfig),
    AccountReviewSubmitModule,
    WorldlineReviewSubmitModule
  ], exports: ([WorldlineReviewOrderSpaComponent])
})
export class WorldlineReviewOrderModule {
}
