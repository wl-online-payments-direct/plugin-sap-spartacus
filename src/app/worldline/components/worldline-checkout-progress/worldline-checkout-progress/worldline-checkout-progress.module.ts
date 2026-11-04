import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmsConfig, ConfigModule, I18nModule, UrlModule} from "@spartacus/core";
import {IconModule} from "@spartacus/storefront";
import {RouterModule} from "@angular/router";
import {CartNotEmptyGuard, CheckoutAuthGuard} from "@spartacus/checkout/base/components";
import {WorldlineCheckoutStepsSetGuard} from "../../../guard/worldline-checkout-steps-set.guard";
import {WorldlineCheckoutProgressComponent} from "./worldline-checkout-progress.component";
import {MultiLinePipe} from "../multiline-titles.pipe";


@NgModule({
  declarations: [WorldlineCheckoutProgressComponent, MultiLinePipe],
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    RouterModule,
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlineCheckoutProgress: {
          component: WorldlineCheckoutProgressComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard, WorldlineCheckoutStepsSetGuard],
        }
      }
    } as CmsConfig),
    UrlModule
  ], exports: ([WorldlineCheckoutProgressComponent])
})
export class WorldlineCheckoutProgressModule {
}
