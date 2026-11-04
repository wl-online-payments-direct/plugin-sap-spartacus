
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { SemanticPathService } from '@spartacus/core';
import { OrderFacade } from '@spartacus/order/root';
import {PlaceOrderService} from '../facade/place-order.service';
import { Observable } from 'rxjs' ;
import { map } from 'rxjs/operators';
@Injectable({  providedIn: 'root'})

export class WorldlineOrderConfirmationGuard {
	constructor(protected orderFacade: OrderFacade,
				protected router: Router,
				protected semanticPathService: SemanticPathService,
				protected placeOrderService: PlaceOrderService) {}

	canActivate(): Observable<boolean | UrlTree> {
    console.log('WorldlineOrderConfirmationGuard invoked for route:', this.router.routerState.root.routeConfig?.path);
		return this.placeOrderService.getOrderDetails().pipe(map((orderDetails) => {
          if (orderDetails && Object.keys(orderDetails).length !== 0) {
            return true;
          } else {
                return this.router.parseUrl(this.semanticPathService.get('orders') ?? '');
          }
		    })
		);
	}
}
