import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {WorldlineScheduleReplenishmentForm} from "../../../model/cart.model";
import {WorldlineCheckoutReplenishmentFormService} from "../../../facade/worldline-checkout-replenishment-form-service";
import {ReplenishmentService} from "../../../facade/replenishment.service";
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ActiveCartFacade } from '@spartacus/cart/base/root';

@Component({
  selector: 'app-worldline-cart-proceed-to-checkout',
  templateUrl: './worldline-cart-proceed-to-checkout.component.html',
  styleUrls: ['./worldline-cart-proceed-to-checkout.component.scss']
})
export class WorldlineCartProceedToCheckoutComponent implements OnInit, OnDestroy {
  protected activeCartFacade: ActiveCartFacade;
  protected router: Router;
  protected cd?: ChangeDetectorRef | undefined;
  protected subscription: Subscription;

  disablePlaceOrderBtnInternal: boolean;
  scheduleReplenishmentFormData: WorldlineScheduleReplenishmentForm;
  cartValidationInProgress: boolean;

  constructor(router: Router,
              activeCartFacade: ActiveCartFacade,
              protected checkoutReplenishmentFormService: WorldlineCheckoutReplenishmentFormService,
              protected replenishmentService: ReplenishmentService,
              cd?: ChangeDetectorRef) {
      this.router = router;
      this.cd = cd;
      this.cartValidationInProgress = false;
      this.subscription = new Subscription();
  }
  ngOnInit() {
      this.subscription.add(this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd ||
              event instanceof NavigationCancel) {
              this.cartValidationInProgress = false;
              this.cd?.markForCheck();
          }
      }));
      this.subscription.add(this.replenishmentService.disableBtnChange.subscribe(value => this.disablePlaceOrderBtnInternal = value));

  }
  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  disableButtonWhileNavigation() {
      this.cartValidationInProgress = true;
  }

  saveReplenishmentData(): void {
      this.checkoutReplenishmentFormService
        .getScheduleReplenishmentFormData()
        .subscribe((data) => {
          this.scheduleReplenishmentFormData = data;
        });
      this.replenishmentService.saveReplenishmentData(this.scheduleReplenishmentFormData);
  }
}
