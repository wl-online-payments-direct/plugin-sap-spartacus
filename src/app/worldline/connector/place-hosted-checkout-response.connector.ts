import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {OccEndpointsService } from "@spartacus/core";
import { ReplenishmentOrder } from '@spartacus/order/root/model';
import { ORDER_TYPE } from '@spartacus/order/root';
import {Observable} from "rxjs";
import {Order} from "../model/cart.model";

@Injectable({
  providedIn: 'root',
})
export class PlaceHostedCheckoutResponseConnector {
  constructor(protected http: HttpClient,
              protected occEndpoints: OccEndpointsService) {
  }

  placeHostedCheckout(payload:{
    userId:string,
    orderOrReplenishmentCode:string,
    orderType:string,
    params:{
      RETURNMAC: string,
      hostedCheckoutId: string,
      cartId: string
    }
  }): Observable<Order | ReplenishmentOrder> {
    let endpoint = this.occEndpoints.buildUrl('submitHostedCheckout', {
      urlParams: {userId:payload.userId, orderOrReplenishmentCode:payload.orderOrReplenishmentCode},
      queryParams: {
        'RETURNMAC': payload.params.RETURNMAC,
        'hostedCheckoutId': payload.params.hostedCheckoutId,
        'cartId': payload.params.cartId,
        'orderType':payload.orderType
      },
    });
    return this.http.post<Order | ReplenishmentOrder>(endpoint, {});
  }
}
