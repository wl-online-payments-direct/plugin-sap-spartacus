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
  PromotionsModule,
} from '@spartacus/storefront';
import { CartSharedModule } from '@spartacus/cart/base/components';
import {MandateDetailComponent} from "./mandate-detail.component";

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
  ],
  declarations: [MandateDetailComponent],
  exports: [MandateDetailComponent
  ],
})
export class MandateDetailModule {}
