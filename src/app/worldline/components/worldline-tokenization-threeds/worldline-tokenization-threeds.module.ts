import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmsConfig, ConfigModule, I18nModule} from "@spartacus/core";
import {IconModule} from "@spartacus/storefront";
import {RouterModule} from "@angular/router";
import {WorldlineTokenizationThreedsComponent} from "./worldline-tokenization-threeds.component";
import {CartNotEmptyGuard, CheckoutAuthGuard} from "@spartacus/checkout/base/components";


@NgModule({
  declarations: [WorldlineTokenizationThreedsComponent],
  imports: [
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlineTokenization3DS: {
          component: WorldlineTokenizationThreedsComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard]
        }
      }

    } as CmsConfig)
  ], exports: ([WorldlineTokenizationThreedsComponent])
})
export class WorldlineTokenizationThreedsModule {
}
