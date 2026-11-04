import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConverterService, OccEndpointsService } from "@spartacus/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {Order} from "../model/cart.model";

@Injectable({
  providedIn: 'root',
})
export class PayByLinkConnector {
  constructor(protected http: HttpClient,
              protected occEndpoints: OccEndpointsService,
              protected converter: ConverterService) { }

  submit(userId: string, cartId: string): Observable<Order> {
    let endpoint = this.occEndpoints.buildUrl('payByLink',{
      urlParams: {userId},
      queryParams: {
        cartId
      },
    });
    return this.http.post<Order>(endpoint, {});
    // return this.http.post<Object>(endpoint,
    //   {
    //   screenHeight: window.screen.height,
    //   screenWidth: window.screen.width,
    //   navigatorJavaEnabled: window.navigator.javaEnabled(),
    //   navigatorJavaScriptEnabled: true,
    //   timezoneOffsetUtcMinutes: new Date().getTimezoneOffset(),
    //   locale: window.navigator.language,
    //   userAgent: window.navigator.userAgent,
    //   acceptHeader: "application/json",
    //   colorDepth: window.screen.colorDepth
    // }
    // ).pipe(map((resp) => {
    //   return this.converter.convert(resp, TOKEN_RESULT_NORMALIZER);
    // }));
  }

}
