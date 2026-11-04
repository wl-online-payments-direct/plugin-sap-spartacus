import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthGuard, CmsConfig, ConfigModule, I18nModule} from "@spartacus/core";
import {CardModule, IconModule, SpinnerModule} from "@spartacus/storefront";
import {RouterModule} from "@angular/router";
import {WorldlinePaymentMethodsComponent} from "./worldline-payment-methods.component";


@NgModule({
  declarations: [WorldlinePaymentMethodsComponent],
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    RouterModule,
    ConfigModule.withConfig({
      cmsComponents: {
        AccountWorldlinePaymentDetailsComponent: {
          component: WorldlinePaymentMethodsComponent,
          guards: [AuthGuard]
        }
      }
    } as CmsConfig),
    SpinnerModule,
    CardModule,
  ], exports: ([WorldlinePaymentMethodsComponent])
})
export class WorldlinePaymentMethodsModule {
}
