import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {CmsConfig, ConfigModule, I18nModule, UrlModule, FeaturesConfigModule} from "@spartacus/core";
import {CardModule, ProgressButtonModule} from '@spartacus/storefront';
import { CartSharedModule, CartCouponModule } from '@spartacus/cart/base/components';
import { WorldlineScheduleReplenishmentOrderModule } from '../../../components/worldline-schedule-replenishment-order/worldline-schedule-replenishment-order.module';
import { WorldlineCartTotalsComponent } from './worldline-cart-totals.component';

@NgModule({
  declarations: [
    WorldlineCartTotalsComponent
  ],
  imports: [
    ConfigModule.withConfig({
        cmsComponents: {
          CartTotalsComponent: {
            component: WorldlineCartTotalsComponent
          }
        }
      } as CmsConfig),
    CommonModule,
    RouterModule,
    UrlModule,
    //CartSharedModule,
    I18nModule,
    CartCouponModule,
    FeaturesConfigModule,
    ProgressButtonModule,
    WorldlineScheduleReplenishmentOrderModule
  ]
})
export class WorldlineCartTotalsModule { }
