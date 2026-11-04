import { Component, OnInit } from '@angular/core';
import { CartTotalsComponent } from '@spartacus/cart/base/components';
import { Cart, OrderEntry } from '@spartacus/cart/base/root';
import {Observable, Subscription, BehaviorSubject} from "rxjs";
import {WorldlineScheduleReplenishmentForm} from "../../../model/cart.model";
import {WorldlineCheckoutReplenishmentFormService} from "../../../facade/worldline-checkout-replenishment-form-service";
import {ReplenishmentService} from "../../../facade/replenishment.service";
import { recurrencePeriod, ORDER_TYPE } from '@spartacus/order/root';


@Component({
  selector: 'app-worldline-cart-totals',
  templateUrl: './worldline-cart-totals.component.html',
  styleUrls: ['./worldline-cart-totals.component.scss']
})
export class WorldlineCartTotalsComponent extends CartTotalsComponent {}
