import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmsConfig, ConfigModule, I18nModule, UrlModule} from "@spartacus/core";
import {IconModule} from "@spartacus/storefront";
import {RouterModule} from "@angular/router";
import {CartNotEmptyGuard, CheckoutAuthGuard} from "@spartacus/checkout/base/components";
import {WorldlineCheckoutStepsSetGuard} from "../../../guard/worldline-checkout-steps-set.guard";
import {WorldlineCheckoutProgressMobileTopComponent} from "./worldline-checkout-progress-mobile-top.component";


@NgModule({
  declarations: [WorldlineCheckoutProgressMobileTopComponent],
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    RouterModule,
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlineCheckoutProgressMobileTop: {
          component: WorldlineCheckoutProgressMobileTopComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard, WorldlineCheckoutStepsSetGuard],
        }
      }
    } as CmsConfig),
    UrlModule
  ], exports: ([WorldlineCheckoutProgressMobileTopComponent])
})
export class WorldlineCheckoutProgressMobileTopModule {
}
