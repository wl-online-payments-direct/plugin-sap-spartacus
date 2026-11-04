import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmsConfig, ConfigModule} from "@spartacus/core";
import {OrderDetailsService, ReplenishmentOrderDetailsService} from "@spartacus/order/components";
import {MandateDetailModule} from "../../../shared/component/mandate-detail/mandate-detail.module";
import {WorldlineAccountMandateDetailComponent} from "./worldline-account-mandate-detail.component";

@NgModule({
  declarations: [WorldlineAccountMandateDetailComponent],
  imports: [
    CommonModule,
    MandateDetailModule,
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlineMyAccountReplenishmentMandateDetailsComponent: {
          component: WorldlineAccountMandateDetailComponent,
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: ReplenishmentOrderDetailsService,
            },
          ]
        },
        WorldlineMyAccountOrderMandateDetailsComponent: {
          component: WorldlineAccountMandateDetailComponent,
        }
      }

    } as CmsConfig)
  ],
  exports: ([WorldlineAccountMandateDetailComponent])
})
export class WorldlineAccountMandateDetailModule {
}
