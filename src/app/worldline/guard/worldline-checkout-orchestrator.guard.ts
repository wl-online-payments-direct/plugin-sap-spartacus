import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { CheckoutGuard } from '@spartacus/checkout/base/components';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorldlineCheckoutOrchestratorGuard {
  constructor(protected router: Router, protected checkoutGuard: CheckoutGuard) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const snapshotUrl = '/' + route.pathFromRoot
      .flatMap(snapshot => snapshot.url.map(segment => segment.path)).join('/');
    return (this.router.url.includes('/checkout/worldline-payment-method') ||
      this.router.url.includes('/checkout/worldline-order-review') ||
      snapshotUrl.includes('/checkout/worldline-payment-method') ||
      snapshotUrl.includes('/checkout/worldline-order-review'))
      ? of(true) : this.checkoutGuard.canActivate();
  }
}
