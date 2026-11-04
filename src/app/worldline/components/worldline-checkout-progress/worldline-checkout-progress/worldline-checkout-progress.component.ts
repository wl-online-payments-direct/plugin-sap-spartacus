import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {CheckoutStepService} from "@spartacus/checkout/base/components";
import {CheckoutStep} from "@spartacus/checkout/base/root";

@Component({
  selector: 'app-worldline-checkout-progress',
  templateUrl: './worldline-checkout-progress.component.html',
  styleUrls: ['./worldline-checkout-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorldlineCheckoutProgressComponent {
  private _steps$: BehaviorSubject<CheckoutStep[]> = this.checkoutStepService
    .steps$;

  constructor(protected checkoutStepService: CheckoutStepService) {}

  activeStepIndex: number;
  activeStepIndex$: Observable<number> = this.checkoutStepService.activeStepIndex$.pipe(
    tap((index) => (this.activeStepIndex = index))
  );

  get steps$(): Observable<CheckoutStep[]> {
    return this._steps$.asObservable();
  }

  getTabIndex(stepIndex: number): number {
    return !this.isActive(stepIndex) && !this.isDisabled(stepIndex) ? 0 : -1;
  }

  isActive(index: number): boolean {
    return index === this.activeStepIndex;
  }

  isDisabled(index: number): boolean {
    return index > this.activeStepIndex;
  }
}
