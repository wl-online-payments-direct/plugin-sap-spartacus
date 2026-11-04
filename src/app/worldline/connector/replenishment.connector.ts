import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {OccEndpointsService} from "@spartacus/core";
import {Observable} from "rxjs";
import {WorldlineScheduleReplenishmentForm} from "../model/cart.model";

@Injectable({
  providedIn: 'root',
})
export class ReplenishmentConnector {
  constructor(protected http: HttpClient, protected occEndpoints: OccEndpointsService) {
  }


  isRecurringPossible(userId: String, cartId: String): Observable<boolean> {
    let endpoint = this.occEndpoints.buildUrl("isRecurringPossible", {
      urlParams: {userId,cartId},
    });
    return this.http.get<boolean>((endpoint), {});
  }

  saveReplenishmentData(userId: String, cartId: String, body: any) {
      let endpoint = this.occEndpoints.buildUrl("saveReplenishmentData", {
        urlParams: {userId, cartId},
      });
      this.http.post((endpoint), body).subscribe();
    }
  getReplenishmentData(userId: String, cartId: String): Observable<WorldlineScheduleReplenishmentForm> {
    let endpoint = this.occEndpoints.buildUrl("getReplenishmentData", {
      urlParams: {userId, cartId},
    });
    return this.http.get<WorldlineScheduleReplenishmentForm>(endpoint);
  }
}
