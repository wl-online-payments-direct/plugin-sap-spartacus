import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConverterService, Occ, OccEndpointsService, PaymentDetails, PAYMENT_DETAILS_NORMALIZER, UserPaymentAdapter } from '@spartacus/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class WorldlineUserPaymentAdapter implements UserPaymentAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) { }

  loadAll(userId: string): Observable<PaymentDetails[]> {
    const url =
      this.occEndpoints.buildUrl('/users/' + userId + '/worldlinePaymentDetails');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<Occ.PaymentDetailsList>(url, { headers })
      .pipe(
        catchError((error: any) => throwError(error)),
        map((methodList) => methodList.payments),
        this.converter.pipeableMany(PAYMENT_DETAILS_NORMALIZER)
      );
  }

  delete(userId: string, paymentMethodID: string): Observable<{}> {
    const url =
      this.occEndpoints.buildUrl('/users/' + userId + '/worldlinePaymentDetails/' + paymentMethodID);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .delete(url, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  setDefault(userId: string, paymentMethodID: string): Observable<{}> {
    const url = this.occEndpoints.buildUrl('/users/' + userId + '/worldlinePaymentDetails/'+ paymentMethodID);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .patch(
        url,
        // TODO: Remove billingAddress property
        { headers }
      )
      .pipe(catchError((error: any) => throwError(error)));
  }
}
