import {Component, OnDestroy, OnInit} from '@angular/core';
import {CheckoutPaymentTypeFacade} from '@spartacus/checkout/b2b/root';
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-worldline-review-order',
  templateUrl: './worldline-review-order.component.html',
  styleUrls: ['./worldline-review-order.component.scss']
})
export class WorldlineReviewOrderSpaComponent implements OnInit, OnDestroy {
  constructor(
    protected paymentTypeService: CheckoutPaymentTypeFacade,
    protected router: Router
  ) {
  }

  ngOnInit(): void {

  }


  isAccountPayment(): Observable<Boolean> {
    return this.paymentTypeService.isAccountPayment();
  }

  ngOnDestroy(): void {
  }

}
