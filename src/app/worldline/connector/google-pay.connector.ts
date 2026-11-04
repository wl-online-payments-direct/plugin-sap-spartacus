import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConverterService, OccEndpointsService } from "@spartacus/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TOKEN_RESULT_NORMALIZER } from "../converter/converters";
import { TokenizationResult } from "../model/tokenization.model";

@Injectable({
  providedIn: 'root',
})
export class GooglePayConnector {
  constructor(protected http: HttpClient,
              protected occEndpoints: OccEndpointsService,
              protected converter: ConverterService) { }

  submit(userId: string, cartId: string): Observable<TokenizationResult> {
    let endpoint = this.occEndpoints.buildUrl('googlePay',{
      urlParams: {userId},
      queryParams: {
        cartId
      },
    });
    return this.http.post<Object>(endpoint, {
      screenHeight: window.screen.height,
      screenWidth: window.screen.width,
      navigatorJavaEnabled: window.navigator.javaEnabled(),
      navigatorJavaScriptEnabled: true,
      timezoneOffsetUtcMinutes: new Date().getTimezoneOffset(),
      locale: window.navigator.language,
      userAgent: window.navigator.userAgent,
      acceptHeader: "application/json",
      colorDepth: window.screen.colorDepth
    }).pipe(map((resp) => {
      return this.converter.convert(resp, TOKEN_RESULT_NORMALIZER);
    }));
  }

  submitReplenishmentOrder(userId: string, cartId: string): Observable<TokenizationResult> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    let endpoint = this.occEndpoints.buildUrl('submitRecurringGooglePay',{
      urlParams: {userId},
      queryParams: {
        cartId,
        termsChecked: true
      },
    });
    return this.http.post<Object>(endpoint, {
      screenHeight: window.screen.height,
      screenWidth: window.screen.width,
      navigatorJavaEnabled: window.navigator.javaEnabled(),
      navigatorJavaScriptEnabled: true,
      timezoneOffsetUtcMinutes: new Date().getTimezoneOffset(),
      locale: window.navigator.language,
      userAgent: window.navigator.userAgent,
      acceptHeader: "application/json",
      colorDepth: window.screen.colorDepth
    }, {headers}).pipe(map((resp) => {
      return this.converter.convert(resp, TOKEN_RESULT_NORMALIZER);
    }));
  }
}
