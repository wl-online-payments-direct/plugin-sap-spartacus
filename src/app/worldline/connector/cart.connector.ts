import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OccEndpointsService } from "@spartacus/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CartWorldline, WorldlinePaymentInfo } from "../model/cart.model";

@Injectable({
    providedIn: 'root',
})
export class PaymentInfoConnector {
    constructor(protected http: HttpClient,
        protected occEndpoints: OccEndpointsService) { }

    load(userId: string, cartId: string): Observable<WorldlinePaymentInfo> {
        let endpoint = 'users/' + userId + "/carts/" + cartId;
        return this.http.get<CartWorldline>(this.occEndpoints.buildUrl(endpoint))
            .pipe((map(result => { return result.worldlinePaymentInfo; })));
    }
}
