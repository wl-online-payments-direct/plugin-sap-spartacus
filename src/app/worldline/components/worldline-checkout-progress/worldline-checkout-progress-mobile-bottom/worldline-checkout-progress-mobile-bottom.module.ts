import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmsConfig, ConfigModule, I18nModule} from "@spartacus/core";
import {IconModule} from "@spartacus/storefront";
import {RouterModule} from "@angular/router";
import {CartNotEmptyGuard, CheckoutAuthGuard} from "@spartacus/checkout/base/components";
import {WorldlineCheckoutProgressMobileBottomComponent} from "./worldline-checkout-progress-mobile-bottom.component";
import {WorldlineCheckoutStepsSetGuard} from "../../../guard/worldline-checkout-steps-set.guard";


@NgModule({
  declarations: [WorldlineCheckoutProgressMobileBottomComponent],
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    RouterModule,
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlineCheckoutProgressMobileBottom: {
          component: WorldlineCheckoutProgressMobileBottomComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard, WorldlineCheckoutStepsSetGuard],
        }
      }
    } as CmsConfig)
  ], exports: ([WorldlineCheckoutProgressMobileBottomComponent])
})
export class WorldlineCheckoutProgressMobileBottomModule {
}
