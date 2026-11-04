import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-worldline-checkout-fallback',
  template: `
    <ng-container [ngSwitch]="checkoutRoute">
      <app-worldline-payment-method *ngSwitchCase="'payment'"></app-worldline-payment-method>
      <ng-container *ngSwitchCase="'review'">
        <app-worldline-checkout-progress></app-worldline-checkout-progress>
        <app-worldline-review-order></app-worldline-review-order>
        <app-worldline-place-order></app-worldline-place-order>
      </ng-container>
    </ng-container>
  `,
})
export class WorldlineCheckoutFallbackComponent implements OnDestroy {
  checkoutRoute: 'payment' | 'review' | null = null;
  protected destroy$ = new Subject<void>();

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    const snapshotUrl = '/' + this.activatedRoute.snapshot.pathFromRoot
      .flatMap(snapshot => snapshot.url.map(segment => segment.path)).join('/');
    this.setRoute(snapshotUrl || this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationStart), takeUntil(this.destroy$))
      .subscribe(() => this.setRoute(''));
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(event => this.setRoute((event as NavigationEnd).urlAfterRedirects));
  }

  protected setRoute(url: string): void {
    this.checkoutRoute = url.includes('/checkout/worldline-payment-method')
      ? 'payment'
      : url.includes('/checkout/worldline-order-review')
        ? 'review'
        : null;
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
