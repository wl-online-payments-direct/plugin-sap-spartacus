import {NgModule} from '@angular/core';
import {AuthGuard, CmsConfig, ConfigModule} from "@spartacus/core";
import {WorldlineOrderDetailShippingComponent} from "./worldline-order-detail-shipping.component";
import {WorldlineOrderOverviewModule} from "../../../shared/component/worldline-order-overview";
import {OrderDetailsService, ReplenishmentOrderDetailsService} from "@spartacus/order/components";
import {CommonModule} from "@angular/common";
import {OrderApprovalDetailService} from "@spartacus/organization/order-approval";
import {WorldlineApproverGuard} from "../../../guard/worldline-approver.guard";


@NgModule({
  declarations: [WorldlineOrderDetailShippingComponent],
  imports: [
    ConfigModule.withConfig({
      cmsComponents: {
        AccountOrderDetailsShippingComponent: {
          component: WorldlineOrderDetailShippingComponent,
        },
        OrderApprovalDetailShippingComponent: {
          component: WorldlineOrderDetailShippingComponent,
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: OrderApprovalDetailService,
            },
          ],
          guards: [AuthGuard, WorldlineApproverGuard],
        },
        ReplenishmentDetailShippingComponent: {
          component: WorldlineOrderDetailShippingComponent,
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: ReplenishmentOrderDetailsService,
            },
          ],
        }
      }
    } as CmsConfig),
    WorldlineOrderOverviewModule,
    CommonModule,
  ], exports: ([WorldlineOrderDetailShippingComponent])
})
export class WorldlineOrderDetailShippingModule {
}
