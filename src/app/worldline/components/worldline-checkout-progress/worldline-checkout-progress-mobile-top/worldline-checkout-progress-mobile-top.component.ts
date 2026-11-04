import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActiveCartFacade, Cart } from '@spartacus/cart/base/root';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {CheckoutStepService} from "@spartacus/checkout/base/components";
import {CheckoutStep} from "@spartacus/checkout/base/root";

@Component({
  selector: 'app-worldline-checkout-progress-mobile-top',
  templateUrl: './worldline-checkout-progress-mobile-top.component.html',
  styleUrls: ['./worldline-checkout-progress-mobile-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorldlineCheckoutProgressMobileTopComponent implements OnInit {
  private _steps$: BehaviorSubject<CheckoutStep[]> = this.checkoutStepService
    .steps$;

  constructor(
    protected activeCartFacade: ActiveCartFacade,
    protected checkoutStepService: CheckoutStepService
  ) {}

  cart$!: Observable<Cart>;

  activeStepIndex!: number;
  activeStepIndex$: Observable<number> = this.checkoutStepService.activeStepIndex$.pipe(
    tap((index) => (this.activeStepIndex = index))
  );

  get steps$(): Observable<CheckoutStep[]> {
    return this._steps$.asObservable();
  }

  ngOnInit(): void {
    this.cart$ = this.activeCartFacade.getActive();
  }
}
