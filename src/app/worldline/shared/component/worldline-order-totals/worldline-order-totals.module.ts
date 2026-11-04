import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldlineOrderTotalsComponent } from './worldline-order-totals.component';
import { AppliedCouponsComponent } from '@spartacus/cart/base/components';
import { I18nModule, ConfigModule, CmsConfig, FeaturesConfigModule } from '@spartacus/core';
import {
  CardModule,
  PromotionsModule,
} from '@spartacus/storefront';
import { CartSharedModule } from '@spartacus/cart/base/components';


@NgModule({
  declarations: [WorldlineOrderTotalsComponent],
  imports: [
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlineOrderTotalsComponent: {
          component: WorldlineOrderTotalsComponent
        }
      }
    } as CmsConfig),
    CommonModule,
    I18nModule,
    FeaturesConfigModule, //TODO added due to the problem with the cxFeatureLevel directive but still does not resolve the issue
    CardModule,
    //CartSharedModule,
    PromotionsModule
  ],
  exports: [WorldlineOrderTotalsComponent]
})
export class WorldlineOrderTotalsModule { }
