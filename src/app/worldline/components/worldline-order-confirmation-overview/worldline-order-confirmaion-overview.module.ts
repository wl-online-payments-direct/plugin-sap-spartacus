import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmsConfig, ConfigModule, I18nModule} from "@spartacus/core";
import {IconModule} from "@spartacus/storefront";
import {RouterModule} from "@angular/router";
import {OrderConfirmationGuard} from "@spartacus/order/components";
import {WorldlineOrderConfirmationOverviewComponent} from "./worldline-order-confirmation-overview.component";
import {WorldlineOrderOverviewModule} from "../../shared/component/worldline-order-overview";
import {WorldlineOrderConfirmationGuard} from "../../guard/worldline-order-confirmation.guard"

@NgModule({
  declarations: [WorldlineOrderConfirmationOverviewComponent],
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    RouterModule,
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlineReplenishmentConfirmationOverviewComponent: {
          component: WorldlineOrderConfirmationOverviewComponent,
          guards: [WorldlineOrderConfirmationGuard]
        },

        WorldlineOrderConfirmationOverviewComponent: {
          component: WorldlineOrderConfirmationOverviewComponent,
          guards: [WorldlineOrderConfirmationGuard]
        }
      },
    } as CmsConfig),
    WorldlineOrderOverviewModule,
  ], exports: ([WorldlineOrderConfirmationOverviewComponent])
})
export class WorldlineOrderConfirmaionOverviewModule {
}
