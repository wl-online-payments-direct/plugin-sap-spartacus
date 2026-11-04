import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { WorldlineOrderOverviewComponent } from './worldline-order-overview.component';
import {CardModule} from "@spartacus/storefront";

@NgModule({
  imports: [CommonModule, I18nModule, CardModule],
  declarations: [WorldlineOrderOverviewComponent],
  exports: [WorldlineOrderOverviewComponent],
})
export class WorldlineOrderOverviewModule {}
