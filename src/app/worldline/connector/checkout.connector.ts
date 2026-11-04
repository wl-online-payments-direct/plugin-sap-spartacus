import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OccEndpointsService } from "@spartacus/core";
import { CheckoutMethod } from "../model/payment.model";
import {Observable, of} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class CheckoutConnector {
    constructor(protected http: HttpClient,
        protected occEndpoints: OccEndpointsService) { }

    placeOrder(userId: string, cartId: string, termsChecked: boolean) {
        let endpoint = 'users/' + userId + "/carts/" + cartId + "/checkoutType";
        return this.http.get<CheckoutMethod>(this.occEndpoints.buildUrl(endpoint));
    }

    checkHTToken(userId: String, cartId: String): Observable<boolean> {
      let endpoint = this.occEndpoints.buildUrl("isTokenTemporary", {
        urlParams: {userId,cartId},
      });
      if (cartId) {
        return this.http.get<boolean>(endpoint);
      } else {
        return of(false);
      }

    }
}
