import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  I18nModule,
  UrlModule,
} from '@spartacus/core';
import {
  CardModule,
  IconModule,
  OutletModule,
  PromotionsModule,
} from '@spartacus/storefront';
import { CartSharedModule } from '@spartacus/cart/base/components';
import { AccountReviewSubmitComponent } from './account-review-submit.component';

@NgModule({
  imports: [
    CommonModule,
    CardModule,
    //CartSharedModule,
    I18nModule,
    UrlModule,
    RouterModule,
    PromotionsModule,
    IconModule,
    OutletModule,
  ],
  declarations: [AccountReviewSubmitComponent],
  exports: [AccountReviewSubmitComponent],
})
export class AccountReviewSubmitModule {}
