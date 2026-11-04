import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, ConfigModule, I18nModule } from "@spartacus/core";
import { WorldlineOrderConfirmationTotalsComponent } from './worldline-order-confirmation-totals.component';
import { WorldlineOrderTotalsModule } from '../../shared/component/worldline-order-totals/worldline-order-totals.module';
import {WorldlineOrderConfirmationGuard} from "../../guard/worldline-order-confirmation.guard"
import { OrderFacade } from '@spartacus/order/root';
import {PlaceOrderService} from '../../facade/place-order.service';
@NgModule({
  declarations: [
    WorldlineOrderConfirmationTotalsComponent
  ],
  imports: [
    CommonModule,
    I18nModule,
    ConfigModule.withConfig({
      cmsComponents: {
        OrderConfirmationTotalsComponent: {
          component: WorldlineOrderConfirmationTotalsComponent,
          guards: [WorldlineOrderConfirmationGuard],
          providers: [
              {
                  provide: OrderFacade,
                  useExisting: PlaceOrderService,
              },
          ],
        },
        ReplenishmentConfirmationTotalsComponent: {
          component: WorldlineOrderConfirmationTotalsComponent,
          guards: [WorldlineOrderConfirmationGuard],
          providers: [
              {
                  provide: OrderFacade,
                  useExisting: PlaceOrderService,
              },
          ],
        }
      }
    } as CmsConfig),
    WorldlineOrderTotalsModule
  ]
})
export class WorldlineOrderConfirmationTotalsModule { }
