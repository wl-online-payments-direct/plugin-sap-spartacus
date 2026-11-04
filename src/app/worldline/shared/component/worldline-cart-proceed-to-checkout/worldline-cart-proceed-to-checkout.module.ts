import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CmsConfig, ConfigModule, I18nModule, UrlModule, FeaturesConfigModule } from "@spartacus/core";
import { CartProceedToCheckoutComponent } from '@spartacus/cart/base/components';
import { ProgressButtonModule } from '@spartacus/storefront';
import { WorldlineCartProceedToCheckoutComponent } from './worldline-cart-proceed-to-checkout.component';
import { WorldlineScheduleReplenishmentOrderModule } from '../../../components/worldline-schedule-replenishment-order/worldline-schedule-replenishment-order.module';


@NgModule({
  declarations: [
    WorldlineCartProceedToCheckoutComponent
  ],
  imports: [
    ConfigModule.withConfig({
      cmsComponents: {
        CartProceedToCheckoutComponent: {
          component: WorldlineCartProceedToCheckoutComponent
        }
      }
    } as CmsConfig),
    CommonModule,
    I18nModule,
    RouterModule,
    FeaturesConfigModule,
    ProgressButtonModule,
    WorldlineScheduleReplenishmentOrderModule,
    UrlModule
  ]
})
export class WorldlineCartProceedToCheckoutModule { }
