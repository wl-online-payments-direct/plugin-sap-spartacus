import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmsConfig, ConfigModule, I18nModule} from "@spartacus/core";
import {WorldlineScheduleReplenishmentOrderComponent} from "./worldline-schedule-replenishment-order.component";
import {IconModule} from "@spartacus/storefront";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [WorldlineScheduleReplenishmentOrderComponent],
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    RouterModule,
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlineCheckoutScheduleReplenishmentOrderComponent: {
          component: WorldlineScheduleReplenishmentOrderComponent,
        }
      }

    } as CmsConfig)
  ],
  exports: ([WorldlineScheduleReplenishmentOrderComponent])
})
export class WorldlineScheduleReplenishmentOrderModule {
}
