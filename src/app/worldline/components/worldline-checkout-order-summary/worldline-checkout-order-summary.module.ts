import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, ConfigModule, I18nModule } from "@spartacus/core";
import { WorldlineCheckoutOrderSummaryComponent } from './worldline-checkout-order-summary.component';
import { WorldlineOrderTotalsModule } from '../../shared/component/worldline-order-totals/worldline-order-totals.module';
import { WorldlineOrderTotalsComponent } from '../../shared/component/worldline-order-totals/worldline-order-totals.component';

@NgModule({
  declarations: [
    WorldlineCheckoutOrderSummaryComponent
  ],
  imports: [
    CommonModule,
    I18nModule,
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlineCheckoutOrderSummary: {
          component: WorldlineCheckoutOrderSummaryComponent
        }
      }
    } as CmsConfig),
    WorldlineOrderTotalsModule
  ]
})
export class WorldlineCheckoutOrderSummaryModule { }
