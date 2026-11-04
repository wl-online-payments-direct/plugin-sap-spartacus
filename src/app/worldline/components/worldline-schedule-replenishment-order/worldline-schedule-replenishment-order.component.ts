import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subscription, BehaviorSubject} from "rxjs";
import {ICON_TYPE} from "@spartacus/storefront";
import { DaysOfWeek, recurrencePeriod, ORDER_TYPE } from '@spartacus/order/root';
import {ReplenishmentService} from "../../facade/replenishment.service";
import {worldlineRecurrencePeriod, WorldlineScheduleReplenishmentForm} from "../../model/cart.model";
import {WorldlineCheckoutReplenishmentFormService} from "../../facade/worldline-checkout-replenishment-form-service";
import {HOSTED_CHECKOUT_TYPE} from "../../enums/worldline-enums";

@Component({
  selector: 'worldline-schedule-replenishment-order',
  templateUrl: './worldline-schedule-replenishment-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./worldline-schedule-replenishment-order.component.scss']

})
export class WorldlineScheduleReplenishmentOrderComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  disablePlaceOrderBtnInternal = false;

  iconTypes = ICON_TYPE;
  orderTypes = ORDER_TYPE;
  daysOfWeek = Object.values(DaysOfWeek);
  recurrencePeriodType = Object.values(worldlineRecurrencePeriod);

  selectedOrderType$: Observable<ORDER_TYPE> =
    this.checkoutReplenishmentFormService.getOrderType();

  public replenishmentSupported$: Observable<boolean>;
  isReplenishmentOrder: Boolean = false;
  isMonthly: Boolean = false;
  isWeekly: Boolean = false;
  isYearly: Boolean = false;
  currentDaysOfWeek: DaysOfWeek[] = [];
  numberOfDays: string[];
  numberOfWeeks: string[];
  numberOfMonths: string[];
  tomorrowDate: string | undefined;
  replenishmentStartDate: string | undefined;
  endDate: string | undefined;
  scheduleReplenishmentFormData: WorldlineScheduleReplenishmentForm;

  constructor(
    protected replenishmentService:ReplenishmentService,
    protected checkoutReplenishmentFormService: WorldlineCheckoutReplenishmentFormService
  ) {
  }

  ngOnInit(): void {
    this.replenishmentSupported$=this.replenishmentService.isRecurringPossible();
    this.fillReplenishmentData();
  }

  notifyParent() {
    this.replenishmentService.disableProceedToCheckoutBtn(this.disablePlaceOrderBtnInternal);
  }

  fillReplenishmentData(): void {
    let worldlineTest = this.replenishmentService.getReplenishmentData();
    worldlineTest.subscribe(data => {
      if (data.isReplenishmentOrder) {
        let initialFormData: WorldlineScheduleReplenishmentForm = {

        isReplenishmentOrder: data.isReplenishmentOrder,
        recurrencePeriod: data.recurrencePeriod,
        numberOfDays: data.numberOfDays,
        numberOfMonths: data.numberOfMonths,
        numberOfWeeks: data.numberOfWeeks,
        nthDayOfMonth: data.nthDayOfMonth,
        replenishmentEndDate: data.replenishmentEndDate && data.replenishmentEndDate != "" ? data.replenishmentEndDate.split('T')[0] : "",
        replenishmentStartDate: data.replenishmentStartDate.split('T')[0],

        daysOfWeek: data.recurrencePeriod == worldlineRecurrencePeriod.WEEKLY && data.daysOfWeek ? data.daysOfWeek : [DaysOfWeek.MONDAY]
        }
        this.checkoutReplenishmentFormService.setScheduleReplenishmentFormData(initialFormData);

      }
      this.subscription.add(
        this.checkoutReplenishmentFormService
          .getScheduleReplenishmentFormData()
          .subscribe((data) => {
            this.scheduleReplenishmentFormData = data;
          })
      );
      this.changeOrderType(data.isReplenishmentOrder);
      this.validateForm();
      this.initConfig();
    });
  }

  changeOrderType(orderType: boolean): void {
    this.checkoutReplenishmentFormService.setOrderType(orderType ? ORDER_TYPE["SCHEDULE_REPLENISHMENT_ORDER"] : ORDER_TYPE["PLACE_ORDER"]);
    this.checkoutReplenishmentFormService.setScheduleReplenishmentFormData({
      ...this.scheduleReplenishmentFormData,
      isReplenishmentOrder: orderType,
    });
    this.isReplenishmentOrder = this.scheduleReplenishmentFormData.isReplenishmentOrder;
    this.validateForm();
  }

  changeNumberOfDays(nDays: string): void {
    this.checkoutReplenishmentFormService.setScheduleReplenishmentFormData({
      ...this.scheduleReplenishmentFormData,
      numberOfDays: nDays,
    });
  }

  changeNumberOfWeeks(nWeeks: string): void {
    this.checkoutReplenishmentFormService.setScheduleReplenishmentFormData({
      ...this.scheduleReplenishmentFormData,
      numberOfWeeks: nWeeks,
    });
  }
  changeNumberOfMonths(nMonths: string): void {
    this.checkoutReplenishmentFormService.setScheduleReplenishmentFormData({
      ...this.scheduleReplenishmentFormData,
      numberOfMonths: nMonths,
    });
  }

  changeRecurrencePeriodType(type: string): void {
    this.isWeekly = type === worldlineRecurrencePeriod.WEEKLY;
    this.isMonthly = type === worldlineRecurrencePeriod.MONTHLY;
    this.isYearly = type === worldlineRecurrencePeriod.YEARLY;

    this.numberOfDays = this.isMonthly
      ? this.createNumberStringArray(31)
      : this.createNumberStringArray(30);

    if (this.isMonthly)
    {
      this.numberOfMonths=this.createMonthsGaps();
    }
    this.checkoutReplenishmentFormService.setScheduleReplenishmentFormData({
      ...this.scheduleReplenishmentFormData,
      recurrencePeriod: type,
    });
  }

  changeDayOfTheMonth(dayOfMonth: string): void {
    this.checkoutReplenishmentFormService.setScheduleReplenishmentFormData({
      ...this.scheduleReplenishmentFormData,
      nthDayOfMonth: dayOfMonth,
    });
  }

  changeReplenishmentStartDate(date: string): void {
    if (Boolean(date)) {
      this.checkoutReplenishmentFormService.setScheduleReplenishmentFormData({
        ...this.scheduleReplenishmentFormData,
        replenishmentStartDate: date,
      });
      this.validateForm();
    }
  }
  changeReplenishmentEndDate(date: string): void {
      this.checkoutReplenishmentFormService.setScheduleReplenishmentFormData({
        ...this.scheduleReplenishmentFormData,
        replenishmentEndDate: date,
      });
      this.validateForm();
  }

  changeRepeatDays(day: DaysOfWeek, isChecked: boolean): void {
    if (isChecked) {
      this.currentDaysOfWeek = [...this.currentDaysOfWeek];

      this.currentDaysOfWeek.push(day);

      this.checkoutReplenishmentFormService.setScheduleReplenishmentFormData({
        ...this.scheduleReplenishmentFormData,
        daysOfWeek: this.currentDaysOfWeek,
      });
    } else {
      const foundDay = this.currentDaysOfWeek.find((data) => day === data);

      if (!foundDay) return;

      const index = this.currentDaysOfWeek.indexOf(foundDay);
      this.currentDaysOfWeek.splice(index, 1);

      this.checkoutReplenishmentFormService.setScheduleReplenishmentFormData({
        ...this.scheduleReplenishmentFormData,
        daysOfWeek: this.currentDaysOfWeek,
      });
    }

    this.validateForm();
  }

  hasDaysOfWeekChecked(day: DaysOfWeek): boolean {
    return this.currentDaysOfWeek.includes(day);
  }

  private validateForm(): void {
    if (this.scheduleReplenishmentFormData.isReplenishmentOrder) {
      let daysOfWeekInternal = this.scheduleReplenishmentFormData.daysOfWeek.length === 0 &&
                         this.scheduleReplenishmentFormData.recurrencePeriod === recurrencePeriod.WEEKLY;
      let validDatesInternal = false;
      if (Boolean(this.scheduleReplenishmentFormData.replenishmentStartDate)) {
        if (Boolean(this.scheduleReplenishmentFormData.replenishmentEndDate)) {
          let startDate = new Date(this.scheduleReplenishmentFormData.replenishmentStartDate);
          let endDate = new Date(this.scheduleReplenishmentFormData.replenishmentEndDate);
          validDatesInternal = startDate < endDate;
        } else {
          validDatesInternal = true;
        }
      }
      if (!daysOfWeekInternal && validDatesInternal) {
        this.disablePlaceOrderBtnInternal = false;
      } else {
        this.disablePlaceOrderBtnInternal = true;
      }
    } else {
      this.disablePlaceOrderBtnInternal = false;
    }
    this.notifyParent();
  }

  private initConfig(): void {
    this.isYearly =
      this.scheduleReplenishmentFormData.recurrencePeriod ===
      worldlineRecurrencePeriod.YEARLY;

    this.isMonthly =
      this.scheduleReplenishmentFormData.recurrencePeriod ===
      worldlineRecurrencePeriod.MONTHLY;

    this.isWeekly =
      this.scheduleReplenishmentFormData.recurrencePeriod ===
      worldlineRecurrencePeriod.WEEKLY;

    this.currentDaysOfWeek = [
      ...(this.scheduleReplenishmentFormData.daysOfWeek ?? []),
    ];

    this.numberOfDays = this.isMonthly
      ? this.createNumberStringArray(31)
      : this.createNumberStringArray(30);

    if (this.isMonthly)
    {
      this.numberOfMonths=this.createMonthsGaps();
    }

    this.numberOfWeeks = this.createNumberStringArray(12);

    this.replenishmentStartDate =
      this.scheduleReplenishmentFormData.replenishmentStartDate;

    if (this.scheduleReplenishmentFormData.replenishmentEndDate.length > 0) {
      this.endDate = this.scheduleReplenishmentFormData.replenishmentEndDate;
    }

    this.isReplenishmentOrder = this.scheduleReplenishmentFormData.isReplenishmentOrder;
    this.tomorrowDate = this.createTomorrowDate();
  }

  private createNumberStringArray(n: number): string[] {
    return Array(n)
      .fill(0)
      .map((_, y) => (y + 1).toString());
  }

  private createMonthsGaps():string[]{
    return ["1","2","3","4","6"];
  }

  private createTomorrowDate(): string {
    let today = new Date();
    return new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
