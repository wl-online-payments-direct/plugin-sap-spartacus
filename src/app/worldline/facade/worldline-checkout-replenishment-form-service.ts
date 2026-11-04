import {Injectable} from '@angular/core';
import { DaysOfWeek, ORDER_TYPE, recurrencePeriod } from '@spartacus/order/root';
import {BehaviorSubject, Observable} from 'rxjs';
import {worldlineRecurrencePeriod, WorldlineScheduleReplenishmentForm, CartWorldline} from "../model/cart.model";
import {ReplenishmentService} from "./replenishment.service";

@Injectable({
  providedIn: 'root',
})
export class WorldlineCheckoutReplenishmentFormService {
  /**
   * Default form data
   */
  readonly defaultFormData: WorldlineScheduleReplenishmentForm = {
           daysOfWeek: [DaysOfWeek.MONDAY],
           nthDayOfMonth: '1',
           numberOfDays: '14',
           numberOfWeeks: '1',
           numberOfMonths: '1',
           recurrencePeriod: worldlineRecurrencePeriod.DAILY,
           replenishmentStartDate: this.createTomorrowDate(),
           replenishmentEndDate: '',
           isReplenishmentOrder: false
         };
  orderType$ = new BehaviorSubject(ORDER_TYPE.PLACE_ORDER);

  private scheduleReplenishmentFormData$: BehaviorSubject<WorldlineScheduleReplenishmentForm> =
    new BehaviorSubject<WorldlineScheduleReplenishmentForm>(this.defaultFormData);

  constructor(replenishmentService: ReplenishmentService) { }

  getScheduleReplenishmentFormData(): Observable<WorldlineScheduleReplenishmentForm> {
    return this.scheduleReplenishmentFormData$.asObservable();
  }

  setScheduleReplenishmentFormData(formData: WorldlineScheduleReplenishmentForm): void {
    this.scheduleReplenishmentFormData$.next(formData);
  }

  resetScheduleReplenishmentFormData(): void {
    this.scheduleReplenishmentFormData$.next(this.defaultFormData);
  }

  getOrderType() {
      return this.orderType$.asObservable();
  }

  setOrderType(orderType: any) {
      this.orderType$.next(orderType);
  }

  private createTomorrowDate(): string {
    let today = new Date();
    return new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];
  }


}
