import {Component, ComponentRef, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RoutingService, EventService} from '@spartacus/core';
import {LAUNCH_CALLER, LaunchDialogService} from '@spartacus/storefront';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {PlaceOrderService} from '../../facade/place-order.service';
import {worldlineConstants} from "../../constants/worldlineConstants";
import {PlaceHostedCheckoutResponseService} from "../../facade/place-hosted-checkout-response.service";
import {HOSTED_CHECKOUT_PARAMS} from "../../enums/worldline-enums";
import {WorldlineCheckoutReplenishmentFormService} from "../../facade/worldline-checkout-replenishment-form-service";
import { ORDER_TYPE, OrderFacade, OrderPlacedEvent, ReplenishmentOrderScheduledEvent } from '@spartacus/order/root';
import { CheckoutQueryResetEvent } from '@spartacus/checkout/base/root';
import { RemoveCartEvent } from '@spartacus/cart/base/root';

@Component({
  selector: 'app-worldline-hosted-checkout-response',
  templateUrl: './worldline-hosted-checkout-response.component.html',
  styleUrls: ['./worldline-hosted-checkout-response.component.scss']
})
export class WorldlineHostedCheckoutResponseComponent implements OnInit, OnDestroy {
  paymentProcessing: void | Observable<ComponentRef<any>>;
  private subscription: Subscription = new Subscription();
  private cartID: string;
  private orderType: ORDER_TYPE;
  private userId: string;

  constructor(protected orderFacade: OrderFacade,
              protected eventService: EventService,
              protected checkoutReplenishmentFormService: WorldlineCheckoutReplenishmentFormService,
              protected placeHostedCheckoutResponseService: PlaceHostedCheckoutResponseService,
              protected routingService: RoutingService, protected placeOrderService: PlaceOrderService, protected vcr: ViewContainerRef, protected launchDialogService: LaunchDialogService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.paymentProcessing = this.launchDialogService.launch(
      LAUNCH_CALLER.PLACE_ORDER_SPINNER,
      this.vcr
    );
    this.subscription.add(
      combineLatest([
        this.placeHostedCheckoutResponseService.getSubmitSuccess(),
        this.placeHostedCheckoutResponseService.getSubmitFail(),
        this.placeHostedCheckoutResponseService.getSubmitCancel(),
      ]).subscribe(([submitSuccess, submitFail, submitCancel]) => {
        if (submitSuccess) {
          this.placeHostedCheckoutResponseService.getSubmitData().subscribe(response => {
            this.placeHostedCheckoutResponseService.onSubmitSuccess(response, this.cartID, this.orderType, this.userId);
          }).unsubscribe();
          return;
        }
        if (submitFail) {
          this.routingService.go({cxRoute: worldlineConstants.cms.contentPages.worldlinePaymentMethod.id}, {queryParams: {'state': 'REJECTED'}});
          return;
        }
        if (submitCancel) {
          this.routingService.go({cxRoute: worldlineConstants.cms.contentPages.worldlinePaymentMethod.id}, {queryParams: {'state': 'CANCELLED'}});
          return;
        }
      })
    );
    this.subscription.add(this.eventService
        .get(OrderPlacedEvent)
        .subscribe(({ userId, cartId, cartCode }) => {
        this.eventService.dispatch({
            userId,
            cartId,
            cartCode,
        }, RemoveCartEvent);
        this.eventService.dispatch({}, CheckoutQueryResetEvent);
        return this.onSuccess();
    }));

    this.subscription.add(this.eventService
        .get(ReplenishmentOrderScheduledEvent)
        .subscribe(({ userId, cartId, cartCode }) => {
        this.eventService.dispatch({
            userId,
            cartId,
            cartCode,
        }, RemoveCartEvent);
        this.eventService.dispatch({}, CheckoutQueryResetEvent);
        return this.onSuccess();
    }));

    this.route.queryParamMap.subscribe(params => {
      this.cartID = params.get(HOSTED_CHECKOUT_PARAMS.CART_ID);
      this.orderType = ORDER_TYPE[params.get(HOSTED_CHECKOUT_PARAMS.ORDER_TYPE) as keyof typeof ORDER_TYPE];
      this.userId = params.get(HOSTED_CHECKOUT_PARAMS.USER_ID);
      if (params.get(HOSTED_CHECKOUT_PARAMS.RETURN_MAC)) {
        this.placeHostedCheckoutResponseService.submit(params.get(HOSTED_CHECKOUT_PARAMS.USER_ID), params.get(HOSTED_CHECKOUT_PARAMS.ORDER_OR_REPLENNISHMENT_CODE), this.orderType, {
          cartId: this.cartID,
          RETURNMAC: params.get(HOSTED_CHECKOUT_PARAMS.RETURN_MAC),
          hostedCheckoutId: params.get(HOSTED_CHECKOUT_PARAMS.HOSTED_CHECKOUT_ID)
        });
      }
    });
  }

  onSuccess(): void {
    this.checkoutReplenishmentFormService.setOrderType(this.orderType);
    switch (this.orderType) {
      case ORDER_TYPE.PLACE_ORDER: {
        this.routingService.go({cxRoute: 'orderConfirmation'});
        break;
      }
      case ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER: {
        this.routingService.go({cxRoute: 'replenishmentConfirmation'});
        break;
      }
    }
    this.checkoutReplenishmentFormService.resetScheduleReplenishmentFormData();

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.launchDialogService.clear(LAUNCH_CALLER.PLACE_ORDER_SPINNER);
    this.placeHostedCheckoutResponseService.clearSubmitState();
  }

}

