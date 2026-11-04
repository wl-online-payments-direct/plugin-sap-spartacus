import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {OccEndpointsService} from "@spartacus/core";
import { ReplenishmentOrder } from '@spartacus/order/root/model';
import { ORDER_TYPE } from '@spartacus/order/root';
import {Observable} from "rxjs";
import {Order} from "../model/cart.model";

@Injectable({
  providedIn: 'root',
})
export class PlaceHostedTokenizationResponseConnector {
  constructor(protected http: HttpClient,
              protected occEndpoints: OccEndpointsService) {
  }

  placeHostedTokenization(payload:{
    userId: string,
    orderOrReplenishmentCode: string,
    orderType: ORDER_TYPE,
    params:  {
      RETURNMAC: string,
      REF: string,
      paymentId: string,
      cartId: string
    }
  }): Observable<Order | ReplenishmentOrder> {
    let endpoint = this.occEndpoints.buildUrl('submitTokenizationCheckout', {
      urlParams: {userId:payload.userId, orderOrReplenishmentCode:payload.orderOrReplenishmentCode},
      queryParams: {
        'RETURNMAC': payload.params.RETURNMAC,
        'paymentId': payload.params.paymentId,
        'REF': payload.params.REF,
        'cartId': payload.params.cartId,
        'orderType':payload.orderType
      },
    });
    return this.http.post<Order | ReplenishmentOrder>(endpoint, {});
  }
}
