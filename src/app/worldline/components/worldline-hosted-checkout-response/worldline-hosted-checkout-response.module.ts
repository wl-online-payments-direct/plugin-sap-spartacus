import {NgModule} from '@angular/core';
import {CmsConfig, ConfigModule} from "@spartacus/core";
import {CartNotEmptyGuard, CheckoutAuthGuard} from "@spartacus/checkout/base/components";
import {WorldlineHostedCheckoutResponseComponent} from "./worldline-hosted-checkout-response.component";
import {RouterModule} from "@angular/router";
import {CmsPageGuard} from "@spartacus/storefront";


@NgModule({
  declarations: [WorldlineHostedCheckoutResponseComponent],
  imports: [
    ConfigModule.withConfig({
      cmsComponents: {
        WorldlineHostedCheckoutResponse: {
          component: WorldlineHostedCheckoutResponseComponent,
          guards: [CheckoutAuthGuard,CartNotEmptyGuard]
        }
      }

    } as CmsConfig),
    RouterModule.forChild([
      {
        // path with a dynamic parameter:
        path: ':orderType/hostedcheckout',

        // page label without a parameter, starting with slash:
        data: { pageLabel: '/hostedcheckout' },

        // the following are needed to display slots and components from the CMS:
        component: WorldlineHostedCheckoutResponseComponent,
        canActivate: [CmsPageGuard]
      }
    ]),
  ], exports: ([WorldlineHostedCheckoutResponseComponent])
})
export class WorldlineHostedCheckoutResponseModule {
}
