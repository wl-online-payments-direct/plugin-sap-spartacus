import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {OccEndpointsService} from "@spartacus/core";
import {Observable} from "rxjs";
import {HostedCheckout} from "../model/payment.model";

@Injectable({
  providedIn: 'root',
})
export class GetHostedCheckoutConnector {
  constructor(protected http: HttpClient,
              protected occEndpoints: OccEndpointsService) {
  }

  submitOrderHostedCheckout(userId: string, cartId: string, body: any): Observable<HostedCheckout> {
    let endpoint = this.occEndpoints.buildUrl("getHostedCheckout", {
      urlParams: {userId},
      queryParams: {cartId},
    });
    return this.http.post<HostedCheckout>((endpoint), body);
  }

  submitReplenishmentHostedCheckout(userId: string, cartId: string, body: any): Observable<HostedCheckout> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    let endpoint = this.occEndpoints.buildUrl("getRecurringHostedCheckout", {
      urlParams: {userId},
      queryParams: {cartId, termsChecked: true, cardDetailsChecked: true},
    });
    return this.http.post<HostedCheckout>((endpoint),body
      ,{headers});
  }
}
