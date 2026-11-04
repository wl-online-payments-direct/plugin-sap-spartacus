import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Address, ADDRESS_SERIALIZER, ConverterService, OccEndpointsService} from "@spartacus/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {GooglePay, PaymentProductList} from "../model/payment.model";

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodConnector {
  constructor(protected http: HttpClient, protected occEndpoints: OccEndpointsService, protected converter: ConverterService) {
  }

  getAll(userId: string, cartId: string) {
    let endpoint = 'users/' + userId + "/carts/" + cartId + "/paymentProducts";
    return this.http.get<PaymentProductList>(this.occEndpoints.buildUrl(endpoint)).pipe(map((list) => list.paymentProducts));
  }

  getGooglePay(userId: string, cartId: string) {
    let endpoint = 'users/' + userId + "/carts/" + cartId + "/googlePayData";
    return this.http.get<GooglePay>(this.occEndpoints.buildUrl(endpoint))
      .pipe((map(result => {
        return result; })));
  }

  setMethod(userId: string, cartId: string, hostedTokenizationId: string, savedCardCode: string, methodId: string, googlePayEncryptedPaymentData: string, address: Address): Observable<{}> {
    address = this.converter.convert(address, ADDRESS_SERIALIZER);
    let endpoint = 'users/' + userId + "/carts/" + cartId + "/paymentProducts";

    return this.http.post(this.occEndpoints.buildUrl(endpoint), {
      paymentProductId: methodId,
      hostedTokenizationId: hostedTokenizationId,
      savedCardCode: savedCardCode,
      googlePayEncryptedPaymentData: googlePayEncryptedPaymentData,
      billingAddress: address
    });
  }
}
