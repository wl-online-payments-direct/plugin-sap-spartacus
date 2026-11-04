import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject, Subject} from "rxjs";
import {UserIdService, ConverterService, OCC_USER_ID_ANONYMOUS} from "@spartacus/core";
import {ScheduleReplenishmentForm} from '@spartacus/order/root';
import {HttpClient} from "@angular/common/http";
import {ReplenishmentConnector} from "../connector/replenishment.connector";
import {WORLDLINE_REPLENISHMENT_ORDER_FORM_SERIALIZER} from "../converter/converters";
import { CartWorldline, WorldlineScheduleReplenishmentForm } from "../model/cart.model";
import { ActiveCartFacade } from '@spartacus/cart/base/root';

@Injectable({
  providedIn: 'root'
})
export class ReplenishmentService {

  constructor(
    protected activeCartFacade: ActiveCartFacade,
    protected http: HttpClient,
    protected replenishmentConnector: ReplenishmentConnector,
    protected userIdService: UserIdService,
    protected converter: ConverterService
  ) {
    this.disableBtnChange.subscribe((value) => {
        this.disableBtn = value
    });
  }

  disableBtn = false;
  disableBtnChange: Subject<boolean> = new Subject<boolean>();

  isRecurringPossible(): Observable<boolean> {
    let userId, cartId;

    this.userIdService.getUserId().subscribe(occId => userId = occId).unsubscribe();
    this.activeCartFacade
      .getActiveCartId()
      .subscribe((activeCartId) => (cartId = activeCartId))
      .unsubscribe();
    if (userId === OCC_USER_ID_ANONYMOUS) {
      return new Observable<boolean>(observer => observer.next(false));
    }
    return this.replenishmentConnector.isRecurringPossible(userId,cartId);
  }


  saveReplenishmentData(scheduleReplenishmentForm: ScheduleReplenishmentForm): void {
    let userId, cartId;
    this.userIdService.getUserId().subscribe(occId => userId = occId).unsubscribe();
    if (userId !== OCC_USER_ID_ANONYMOUS) {
      this.activeCartFacade
        .getActiveCartId()
        .subscribe((activeCartId) => (cartId = activeCartId))
        .unsubscribe();

        scheduleReplenishmentForm = this.converter.convert(
        scheduleReplenishmentForm,
        WORLDLINE_REPLENISHMENT_ORDER_FORM_SERIALIZER);
      this.replenishmentConnector.saveReplenishmentData(userId,cartId, scheduleReplenishmentForm);
    }
  }

  getReplenishmentData(): Observable<WorldlineScheduleReplenishmentForm> {
    let userId, cartId;

    this.userIdService.getUserId().subscribe(occId => userId = occId).unsubscribe();
    this.activeCartFacade
      .getActiveCartId()
      .subscribe((activeCartId) => (cartId = activeCartId))
      .unsubscribe();
    return this.replenishmentConnector.getReplenishmentData(userId, cartId);
  }

  disableProceedToCheckoutBtn(disableBtnInput: boolean) {
      this.disableBtnChange.next(disableBtnInput)
    }
}
