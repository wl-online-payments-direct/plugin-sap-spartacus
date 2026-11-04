import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {UserIdService} from "@spartacus/core";
import {HttpClient} from "@angular/common/http";
import {SurchargeConnector} from "../connector/surcharge.connector";
import { ActiveCartFacade } from '@spartacus/cart/base/root';

@Injectable({
  providedIn: 'root'
})
export class SurchargeService {

  constructor(
    protected activeCartFacade: ActiveCartFacade,
    protected http: HttpClient,
    protected surchargeConnector: SurchargeConnector,
    protected userIdService: UserIdService,
  ) {
  }


  displaySurcharge(): Observable<boolean> {
    let userId, cartId;

    this.userIdService.getUserId().subscribe(occId => userId = occId).unsubscribe();
    this.activeCartFacade
      .getActiveCartId()
      .subscribe((activeCartId) => (cartId = activeCartId))
      .unsubscribe();
    return this.surchargeConnector.displaySurcharge(userId,cartId);
  }
}
