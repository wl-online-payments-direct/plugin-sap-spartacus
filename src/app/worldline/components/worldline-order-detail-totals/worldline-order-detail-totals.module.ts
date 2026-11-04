import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, ConfigModule, I18nModule } from "@spartacus/core";
import { WorldlineOrderDetailTotalsComponent } from './worldline-order-detail-totals.component';
import { WorldlineOrderTotalsModule } from '../../shared/component/worldline-order-totals/worldline-order-totals.module';

@NgModule({
  declarations: [
    WorldlineOrderDetailTotalsComponent
  ],
  imports: [
    CommonModule,
    I18nModule,
    ConfigModule.withConfig({
      cmsComponents: {
        AccountOrderDetailsTotalsComponent: {
          component: WorldlineOrderDetailTotalsComponent
        },
        ReplenishmentDetailTotalsComponent: {
          component: WorldlineOrderDetailTotalsComponent
        }
      }
    } as CmsConfig),
    WorldlineOrderTotalsModule
  ]
})
export class WorldlineOrderDetailTotalsModule { }
