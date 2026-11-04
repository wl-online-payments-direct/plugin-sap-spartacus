import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmsConfig, ConfigModule} from "@spartacus/core";
import {
  WorldlineOrderConfirmationMandateDetailComponent
} from "./worldline-order-confirmation-mandate-detail.component";
import {MandateDetailModule} from "../../../shared/component/mandate-detail/mandate-detail.module";

@NgModule({
  declarations: [WorldlineOrderConfirmationMandateDetailComponent],
  imports: [
    CommonModule,
    MandateDetailModule,
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlineOrderConfirmationMandateDetailsComponent: {
          component: WorldlineOrderConfirmationMandateDetailComponent,
        }
      }

    } as CmsConfig)
  ],
  exports: ([WorldlineOrderConfirmationMandateDetailComponent])
})
export class WorldlineOrderConfirmationMandateDetailModule {
}
