import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, ConfigModule, I18nModule } from "@spartacus/core";
import { FormErrorsModule, IconModule } from "@spartacus/storefront";
import { RouterModule } from "@angular/router";
import { CartNotEmptyGuard, CheckoutAuthGuard } from "@spartacus/checkout/base/components";
import { WorldlinePaymentMethodComponent } from "./worldline-payment-method.component";
import { WorldlineCheckoutStepsSetGuard } from "../../guard/worldline-checkout-steps-set.guard";
import { ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { CardModule } from '@spartacus/storefront'; // Import the module where cx-card is declared

@NgModule({
  declarations: [WorldlinePaymentMethodComponent],
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    RouterModule,
    ConfigModule.withConfig({
      cmsComponents: {

        WorldlinePaymentMethodComponent: {
          component: WorldlinePaymentMethodComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard, WorldlineCheckoutStepsSetGuard],
        }
      }
    } as CmsConfig),
    ReactiveFormsModule,
    NgSelectModule,
    FormErrorsModule,
    CardModule // Add the module where cx-card is declared
  ],
  exports: [WorldlinePaymentMethodComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line to allow custom elements
})
export class WorldlinePaymentMethodModule {
}
