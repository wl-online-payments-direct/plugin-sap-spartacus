import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {OccEndpointsService} from "@spartacus/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SurchargeConnector {
  constructor(protected http: HttpClient, protected occEndpoints: OccEndpointsService) {
  }


  displaySurcharge(userId: String, cartId: String): Observable<boolean> {
    let endpoint = this.occEndpoints.buildUrl("displaySurcharge", {
      urlParams: {userId,cartId},
    });
    return this.http.get<boolean>((endpoint), {});

  }
}
