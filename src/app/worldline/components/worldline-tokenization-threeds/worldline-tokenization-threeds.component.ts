import {Component, ComponentRef, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RoutingService, EventService} from '@spartacus/core';
import { ORDER_TYPE, OrderFacade, OrderPlacedEvent, ReplenishmentOrderScheduledEvent } from '@spartacus/order/root';
import { CheckoutQueryResetEvent } from '@spartacus/checkout/base/root';
import { RemoveCartEvent } from '@spartacus/cart/base/root';
import {LAUNCH_CALLER, LaunchDialogService} from '@spartacus/storefront';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {PlaceOrderService} from '../../facade/place-order.service';
import {worldlineConstants} from "../../constants/worldlineConstants";
import {PlaceHostedTokenizationResponseService} from "../../facade/place-hosted-checkout-tokenization.service";
import {HOSTED_CHECKOUT_PARAMS} from "../../enums/worldline-enums";
import {WorldlineCheckoutReplenishmentFormService} from "../../facade/worldline-checkout-replenishment-form-service";

@Component({
  selector: 'app-worldline-tokenization-threeds',
  templateUrl: './worldline-tokenization-threeds.component.html',
  styleUrls: ['./worldline-tokenization-threeds.component.scss']
})
export class WorldlineTokenizationThreedsComponent implements OnInit, OnDestroy {
  paymentProcessing: void | Observable<ComponentRef<any>>;
  private subscription: Subscription = new Subscription();
  private cartId:string;
  private orderType:ORDER_TYPE;
  private userId: string;

  constructor(protected checkoutReplenishmentFormService: WorldlineCheckoutReplenishmentFormService,
              protected placeHostedTokenizationResponseService:PlaceHostedTokenizationResponseService,
              protected orderFacade: OrderFacade, protected routingService: RoutingService, protected eventService: EventService, protected placeOrderService: PlaceOrderService, protected vcr: ViewContainerRef, protected launchDialogService: LaunchDialogService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.paymentProcessing = this.launchDialogService.launch(
      LAUNCH_CALLER.PLACE_ORDER_SPINNER,
      this.vcr
    );

    this.subscription.add(
      combineLatest([
        this.placeHostedTokenizationResponseService.getSubmitSuccess(),
        this.placeHostedTokenizationResponseService.getSubmitFail(),
        this.placeHostedTokenizationResponseService.getSubmitCancel(),
      ]).subscribe(([submitSuccess, submitFail, submitCancel]) => {
        if (submitSuccess) {
          this.placeHostedTokenizationResponseService.getSubmitData().subscribe(response => {
            this.placeHostedTokenizationResponseService.onSubmitSuccess(response, this.cartId, this.orderType, this.userId);
          }).unsubscribe();
          return;
        }
        if (submitFail) {
          this.routingService.go({cxRoute: worldlineConstants.cms.contentPages.worldlinePaymentMethod.id}, {queryParams: {'state': 'REJECTED'}});
          return;
        }
        if (submitCancel) {
          this.routingService.go({cxRoute: worldlineConstants.cms.contentPages.worldlineOrderReview.id});
          return;
        }
        return;
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
      if (params.get(HOSTED_CHECKOUT_PARAMS.RETURN_MAC)) {
        this.cartId = params.get(HOSTED_CHECKOUT_PARAMS.CART_ID);
        this.orderType = ORDER_TYPE[params.get(HOSTED_CHECKOUT_PARAMS.ORDER_TYPE) as keyof typeof ORDER_TYPE];
        this.subscription.add(this.placeHostedTokenizationResponseService.submit(params.get(HOSTED_CHECKOUT_PARAMS.USER_ID), params.get(HOSTED_CHECKOUT_PARAMS.ORDER_OR_REPLENNISHMENT_CODE), this.orderType, {
          cartId: this.cartId,
          RETURNMAC: params.get(HOSTED_CHECKOUT_PARAMS.RETURN_MAC),
          REF: params.get(HOSTED_CHECKOUT_PARAMS.REF),
          paymentId: params.get(HOSTED_CHECKOUT_PARAMS.HOSTED_TOKENIZATION_ID)
        }))

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
    this.orderFacade.clearPlacedOrder();
    this.placeHostedTokenizationResponseService.clearSubmitState();
  }

}
