import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthGuard, CmsConfig, ConfigModule, I18nModule, UrlModule} from "@spartacus/core";
import {IconModule} from "@spartacus/storefront";
import {RouterModule} from "@angular/router";
import {WorldlinePlaceOrderComponent} from "./worldline-place-order.component";
import {CartNotEmptyGuard, CheckoutAuthGuard} from "@spartacus/checkout/base/components";
import {WorldlineCheckoutStepsSetGuard} from "../../guard/worldline-checkout-steps-set.guard";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [WorldlinePlaceOrderComponent],
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    RouterModule,
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlinePlaceOrder: {
          component: WorldlinePlaceOrderComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard, WorldlineCheckoutStepsSetGuard],
        }
      }
    } as CmsConfig),
    ReactiveFormsModule,
    UrlModule
  ], exports: ([WorldlinePlaceOrderComponent])
})
export class WorldlinePlaceOrderModule {
}
