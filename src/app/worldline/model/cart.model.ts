import {Address, Price} from "@spartacus/core";
import { DaysOfWeek } from '@spartacus/order/root';
import { Cart as CxCart} from '@spartacus/cart/base/root/models';
import { Order as CxOrder} from '@spartacus/order/root/model';
import { ReplenishmentOrder as CxReplenishmentOrder} from '@spartacus/order/root/model';
import {MandateDetail} from "./mandateDetail";
import {ScheduleReplenishmentForm} from "@spartacus/order/root/model/scheduled-replenishment.model";
export interface WorldlineCheckoutType {
    worldlineCheckoutType: string
}

export const worldlineRecurrencePeriod = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
};


export interface WorldlinePaymentInfo {
  worldlineCheckoutType?: WorldlineCheckoutType;
  paymentProductId?: string;
  paymentMethod?: string;
  cardholderName?: string;
  useDeliveryAddress?: boolean;
  billingAddress?: Address;
  mandateDetail?: MandateDetail;
  paymentLinkRedirectionUrl?: string;
}

export interface CartWorldline {
    worldlinePaymentInfo?: WorldlinePaymentInfo;
}

export interface Cart extends CxCart {
  worldlinePaymentInfo?: WorldlinePaymentInfo;
  numberOfMonths?: string;
  replenishmentEndDate?: string;
  isReplenishmentOrder?: boolean;
  daysOfWeek?: DaysOfWeek[];
  nthDayOfMonth?: string;
  numberOfDays?: string;
  numberOfWeeks?: string;
  recurrencePeriod?: string;
  replenishmentStartDate?: string;
  surcharge?: Price;
}

export interface Order extends CxOrder {
  worldlinePaymentInfo?: WorldlinePaymentInfo;
  surcharge?: Price;
}

export interface ReplenishmentOrder extends CxReplenishmentOrder {
  worldlinePaymentInfo?: WorldlinePaymentInfo;
  surcharge?: Price;
}

export interface WorldlineScheduleReplenishmentForm extends ScheduleReplenishmentForm {
  numberOfMonths?: string;
  replenishmentEndDate?: string;
  isReplenishmentOrder?: boolean;
}
