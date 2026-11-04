import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import {
  CardModule,
  IconModule,
  OutletModule,
  PromotionsModule,
} from '@spartacus/storefront';
import { CartSharedModule } from '@spartacus/cart/base/components';
import {WorldlineCartReviewSubmitComponent} from "./worldline-review-submit.component";
import { CartNotEmptyGuard, CheckoutAuthGuard } from '@spartacus/checkout/base/components';


@NgModule({
  imports: [
    CommonModule,
    CardModule,
    //CartSharedModule, //TODO: If Commented out  the Order Summary appears twice on the OOTB checkout steps -  Method of Payment, Shipping Address, Delivery Mode, but the Cart Total does not appear at the Review Checkout Step. But items appear correclty on the Review Order Page before placing an order.
    I18nModule,
    UrlModule,
    RouterModule,
    PromotionsModule,
    IconModule,
    OutletModule,
  ],
  declarations: [WorldlineCartReviewSubmitComponent],
  exports: [WorldlineCartReviewSubmitComponent],
})
export class WorldlineReviewSubmitModule {}
